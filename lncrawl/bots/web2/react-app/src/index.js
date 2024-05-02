import Header from './components/Header'
import Footer from './components/Footer'
import Browse from './pages/Browse'
import NovelInfo from './pages/NovelInfo'
import Chapter from './pages/Chapter'
import PageNotFound from './pages/PageNotFound'
import ChapterList from './pages/ChapterList'
import Search from './pages/Search'
import AddNovel from './pages/AddNovel'
import Home from './pages/Home'
import Chat from './pages/Chat'
// import Maintenance from './components/Maintenance';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { CookiesProvider } from 'react-cookie'
import ScrollToTop from './scrollToTop'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
// const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(
//     <CookiesProvider>
//         <Router>
//             <ScrollToTop />
//             <Header />
//             <Routes>
//                 <Route path='/' element={<Home />}>
//                   <Route path='search' element={<Search />} />
//                     <Route path='/browse/' element={<Navigate to='/browse/page-1' />} />
//                     <Route path='/browse/page-:page' element={<Browse />} />
//                     <Route path='/chat/chat-:subject/:part' element={<Chat />} />
//                     <Route path='/novel/:novelSlug/:sourceSlug' element={<NovelInfo />} />
//                     <Route path='/novel/:novelSlug/:sourceSlug/chapter-:chapterId' element={<Chapter />} />
//                     <Route path='/novel/:novelSlug/:sourceSlug/chapterlist/page-:page' element={<ChapterList />} />
//                     <Route path='/addnovel/' element={<AddNovel />} />
//                 </Route>
//                 <Route path='*' element={<PageNotFound />} />
//             </Routes>
//             <Footer />
//         </Router>
//     </CookiesProvider>
// )

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <CookiesProvider>
        <Router>
            <ScrollToTop />
            <Header />
            <App />
            <Footer />
        </Router>
    </CookiesProvider>
)

function App () {
    return (
        <Routes>
            <Route path='/'>
                <Route index element={<Home />} />
                <Route path='/search/' element={<Search />} />
                <Route path='/browse/'>
                    <Route index element={<Navigate to='/browse/page-1' />} />
                    <Route path=':page' element={<Browse />} />
                </Route>
                <Route path='/novel/'>
                    <Route index element={<Navigate to='/' />} />
                    <Route path=':novelSlug/:sourceSlug' element={<NovelInfo />} />
                    <Route path=':novelSlug/:sourceSlug/:chapterId' element={<Chapter />} />
                    <Route path=':novelSlug/:sourceSlug/chapterlist/:page' element={<ChapterList />} />
                </Route>
                <Route path='/addnovel/' element={<AddNovel />} />
                <Route path='/chat/:subject/:part' element={<Chat />} />
                <Route path='*' element={<PageNotFound />} />
            </Route>
        </Routes>
    )
}
