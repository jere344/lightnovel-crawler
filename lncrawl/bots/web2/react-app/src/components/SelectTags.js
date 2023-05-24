import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function SelectTags({ urlWithoutTags }) {

    let navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const urlTags = searchParams.get('tags') || "";
    const [tags, setTags] = useState([]);

    // Tags have three state : selected, deselected, and not selected (=> transparent)
    // Selected tags are not prefixed, deselected tags are prefixed with a -, and transparent tags prefixed with a ~
    // Selected tags are tags that the novels must have
    // Deselected tags are tags that the novels must not have
    // Transparent tags does not affect search, but they still need to be shown so that the user can select/deselect them
    const toggleTag = (e) => {
        const tag = e.target.value;

        for (let i = 0; i < tags.length; i++) {
            if (tags[i] === tag) {
                tags[i] = "-" + tag;
                setTags([...tags]);
                break;
            }
            else if (tags[i] === "-" + tag) {
                tags[i] = "~" + tag;
                setTags([...tags]);
                break;
            }
            else if (tags[i] === "~" + tag) {
                tags[i] = "" + tag;
                setTags([...tags]);
                break;
            }
        }
    }

    // Top tags are just tags that are initially transparent
    const [topTag, setTopTag] = useState([]);
    useEffect(() => {
        // topTag are cached so that we don't need to fetch them again when the user navigate to another page
        if (topTagCache.length !== 0) {
            setTopTag(topTagCache);
            return;
        }

        fetch(`https://api.lncrawler.monster/toptags`).then(
            response => response.json()
        ).then(
            data => {
                setTopTag(data["content"]);
            }
        )
    }, []);

    // tagsSet is used to prevent the useEffect from running multiple times
    // When the page load, we need to add tags in the url to the tag list in the good state (selected or deselected)
    let [tagsSet, setTagsSet] = useState(false);
    if (topTag.length !== 0 && tagsSet === false) {
        const toAdd = [];

        // rawTags is the tags in the url (they already have the correct state)
        urlTags.split(",").forEach((tag) => {
            if (tag !== "") {
                toAdd.push(tag);
            }
        });

        // topTag is the list of tags that are initially transparent and have no prefix yet, except for the ones that were already in the url
        topTag.forEach((tag) => {
            if (!urlTags.includes(tag) && !urlTags.includes("-" + tag) && !urlTags.includes("~" + tag)) {
                toAdd.push("~" + tag);
            }
        });

        setTags(toAdd);
        setTagsSet(true);
    }

    const tagsLi = [];
    tags.forEach((tag) => {
        let tagName = tag
        if (tag.startsWith("-") || tag.startsWith("~")) {
            tagName = tag.substring(1);
        }
        let status = "active";
        if (tag.startsWith("-")) {
            status = "inactive";
        }
        else if (tag.startsWith("~")) {
            status = "";
        }


        tagsLi.push(
            <li key={tagName}>
                <button id="ctg-action" className={status} value={tagName} onClick={toggleTag}>
                    {tagName}
                </button>
            </li>
        )
    });

    function navigateToSearch() {
        let url = urlWithoutTags;
        let newTag = [];
        tags.forEach((tag) => {
            if (!tag.startsWith("~")) {
                newTag.push(tag);
            }
        });

        if (tags.length > 0) {
            url += "tags=" + newTag.join(",");
        }
        navigate(url);
    }


    // Combobox --------------------------------------------------

    const [query, setQuery] = useState('');
    const [comboBoxTags, setComboBoxTags] = useState([]);
    const [timeoutId, setTimeoutId] = useState(0);

    function updateComboBox(query) {
        if (query.length < 3) {
            setComboBoxTags([]);
            return;
        }
        // if match / \(\d+\)/ then it's a tag with occurence number, so we don't need to fetch it
        if (!query.match(/ \(\d+\)/)) {
            fetch(`https://api.lncrawler.monster/search_tags?query=${query}`).then(response => response.json())
                .then(data => setComboBoxTags(data.content));
        }
    }

    const handleChange = e => {
        console.log(e.type)
        const tag = e.target.value.replace(/ \(\d+\)/, ''); // remove occurance number
        // If the query contain a (x) at the end, we assume he clicked on a select choice.
        // So we don't want to clear the tags and start a new query
        if (tag !== e.target.value){
            setQuery(tag);
        }
        // Else he typed, start a new query
        else {
            setQuery(e.target.value);
            //clear the previous tags
            setComboBoxTags([]);
            // clear the previous timeout
            clearTimeout(timeoutId);
            // delay the API call by 1 second to avoid making too many requests
            setTimeoutId(setTimeout(updateComboBox, 1000, e.target.value));
        }
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            
            // Find if the query correspond to a tag sent by the server
            let comboBoxTag = null
            const cleanedQuery = query.toLowerCase().trim().replace(/ \(\d+\)/, ''); // remove occurance number
            for (let i = 0; i < comboBoxTags.length; i++){
                if (cleanedQuery === comboBoxTags[i][0].toLowerCase().trim()){
                    comboBoxTag = comboBoxTags[i][0]
                    break;
                }
            }
            
            // If it does correspond
            if (comboBoxTag) {
                // If the tag isn't already here : add the selected tag to the tags list
                if (!(tags.includes(comboBoxTag) || tags.includes("-" + comboBoxTag) || tags.includes("~" + comboBoxTag))) {
                    setTags([...tags, comboBoxTag]);
                }
                // else toggle the tag
                else {
                    let tagIndex = tags.indexOf("~" + comboBoxTag) !== -1 ? tags.indexOf("~" + comboBoxTag) : tags.indexOf("-" + comboBoxTag);
                    if (tagIndex !== -1) { // false mean it's already selected
                        tags[tagIndex] = comboBoxTag;
                        setTags([...tags]);
                    }

                }
                setQuery('');
            }
            else {
                setQuery(comboBoxTags[0][0]);
            }


        }
    }

    const comboBoxTagsOptions = [];
    comboBoxTags.forEach((tag) => {
        comboBoxTagsOptions.push(
            <option key={tag[0]} value={`${tag[0]} (${tag[1]})`} />

        )
    });



    return (
        <>
        <div id="category-list" className="scroll-wrapper">
            <ul className="action-list">
                {tagsLi}
            </ul>
            </div>
            <div className="action-tags">
                <div className="combo-box-container">
                    <input type="text" value={query} onChange={handleChange} onKeyDown={handleKeyPress} list="combo-box-tags" className="combo-box-tags"
                        placeholder=' search tags' />
                    <datalist id="combo-box-tags">
                        {comboBoxTagsOptions}
                    </datalist>
                    <button className="combo-box-enter" onClick={() => {handleKeyPress({ key: 'Enter' })}}>
                        <p className="icon-plus">+</p>
                    </button>
                </div>
                <div className="search-button-container">
                    <button id="ctg-action" className="search-button" onClick={() => navigateToSearch()}>
                        <i className="icon-search" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default SelectTags

const topTagCache = [];