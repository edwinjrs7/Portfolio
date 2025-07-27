import React, {useEffect} from 'react';
import '../pages/Home.scss';
import logo from '../assets/logo/logo.webp'
import Description from './Description.jsx'
import Works from './Works.jsx';


export default function Home() {
    useEffect(() => {
        const script1 = document.createElement('script');
        script1.type = 'module';
        script1.src = '../public/shaders.js';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.type = 'module';
        script2.src = '../public/script.js'; 
        document.head.appendChild(script2);
    }, [])
    return(
        <>
            <section className="hero">
                <div className="gradient-canvas"></div>
                <div className="hero-logo">
                    <img src={logo} alt="Logo de Edwin Santiago" />
                </div>
            </section>
            <Description/>
            <Works/>
        </>
    )
}
