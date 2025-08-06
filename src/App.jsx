import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/footer";
import Home from "./pages/Home";
import Works from "./pages/Works"
import './globals.css'
function App () {
    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<Home />}/>
                
            </Routes>
            <Footer></Footer>
        </>
    )
}

export default App