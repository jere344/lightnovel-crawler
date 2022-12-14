import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function SelectTags( { missingTagsUrl } ) {

    let navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const rawTags = searchParams.get('tags') || "";
    const [tags, setTags] = useState([]);

    const toggleTag = (e) => {
        const tag = e.target.value;

        for (let i=0; i < tags.length; i++) {
            if (tags[i] === tag) {
                tags[i]= "-" + tag;
                setTags([...tags]);
                break;
            }
            else if (tags[i] === "-" + tag) {
                tags[i]= "~" + tag;
                setTags([...tags]);
                break;
            }
            else if (tags[i] === "~" + tag) {
                tags[i]= "" + tag;
                setTags([...tags]);
                break;
            }
        }
    }
        
    const [topTag, setTopTag] = useState([]);
    useEffect(() => {
        if (topTagCache.length !== 0) {
            setTopTag(topTagCache);
            return;
        }
        
        fetch(`/api/toptags`).then(
            response => response.json()
        ).then(
            data => {
                setTopTag(data["content"]);
            }
        )
    }, []);
    
    let [tagsSet, setTagsSet] = useState(false);
    if (topTag.length !== 0 && tagsSet === false) {
        const toAdd = [];

        rawTags.split(",").forEach((tag) => {
            if (tag !== "") {
                toAdd.push(tag);
            }
        });

        topTag.forEach((tag) => {
            if (!rawTags.includes(tag) && !rawTags.includes("-" + tag) && !rawTags.includes("~" + tag)) {
                toAdd.push("~" + tag);
            }
        });

        setTags(toAdd);
        setTagsSet(true);
    }

    const topTagsLi = [];
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

        
        topTagsLi.push(
            <li key={tagName}>
                <button id="ctg-action" className={status} value={tagName} onClick={toggleTag}>
                    {tagName}
                </button>
            </li>
        )
    });
        
    function navigateToSearch() {
        let url = missingTagsUrl;
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

    return (
        <div id="category-list" className="scroll-wrapper">
            <ul className="action-list">
                {topTagsLi}
            </ul>
            <button id="ctg-action" className="active" onClick={()  => navigateToSearch()}>
                Search
            </button>
        </div>
    )
}

export default SelectTags

const topTagCache = [];