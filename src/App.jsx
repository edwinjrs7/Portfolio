import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe.jsx";
import { useEffect, useState } from "react";

import './globals.css'
function App () {

    

    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/about" element = {<AboutMe />}/>
            </Routes>
            <Footer></Footer>
        </>
    )
}

export default App