import React from 'react';
import ReactDOM from 'react-dom/client';
import Browse from './pages/Browse';
import NovelInfo from './pages/NovelInfo';
import Chapter from './pages/Chapter';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from './scrollToTop';
import PageNotFound from './pages/PageNotFound';
import ChapterList from './pages/ChapterList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/browse/" element={<Navigate to="/browse/page-1" />} />
        <Route path="/browse/page-:page" element={<Browse />} />
        <Route path="/novel/:novelSlug/:sourceSlug" element={<NovelInfo />} />
        <Route path="/novel/:novelSlug/:sourceSlug/chapter-:chapterId" element={<Chapter />} />
        <Route path="/novel/:novelSlug/:sourceSlug/chapterlist/page-:page" element={<ChapterList />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
