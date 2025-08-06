import React, { useRef, useLayoutEffect, useState } from 'react';
import { NavBar } from './MenuBar';
import { AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import style from './header.module.scss'; // Assuming you have a CSS file for styling the header
import { useEffect } from 'react';
import Magnetic from '../common/magnetic/Magnetic'

const Header = () => {
    const header = useRef(null);
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation();
    const button = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (isOpen) setIsOpen(false)
    }, [location])

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.to(button.current, {
            scrollTrigger: {
                trigger: document.documentElement,
                start: 0,
                end: innerHeight,
                onLeave: () => { gsap.to(button.current, { scale: 1, duration: 0.25, ease: "power1.out" }) },
                onEnterBack: () => { gsap.to(button.current, { scale: 0, duration: 0.25, ease: "power1.out" }, setIsOpen(false)) }
            }
        })
    }, [])

    return (
        <>
            <header ref={header} className={style.header}>

                <div className={style.logo}>
                    <div className={style.copy}>©</div>
                    <div className={style.name}>
                        <p className={style.CodeBy}>Code by</p>
                        <p className={style.edwin}>Edwin</p>
                        <p className={style.santiago}>Santiago</p>
                    </div>
                </div>
                <div ref={button} className={style.el} onClick={toggleMenu}>
                    <div className={style.menu_movil}>
                        <p>Menu</p>
                    </div>
                </div>
                <nav className={style.nav}>
                    <Magnetic>
                        <div className={style.el}>
                            <a href="">Sobre Mí</a>
                            <div className={style.indicator}></div>
                        </div>
                    </Magnetic>
                    <Magnetic>
                        <div className={style.el}>
                            <a href="">Proyectos</a>
                            <div className={style.indicator}></div>
                        </div>
                    </Magnetic>
                    <Magnetic>
                        <div className={style.el}>
                            <a href="">Contacto</a>
                            <div className={style.indicator}></div>
                        </div>
                    </Magnetic>
                </nav>

            </header>
            <div ref={button} className={style.headerMenuContainer}>
                <div className={isOpen ? `${style.menutoggle} ${style.opened}` : `${style.menutoggle} closed`} onClick={toggleMenu}>
                    <div className={style.menutoggleicon}>
                        <div className={style.hamburger}>
                            <div className={style.menubar} data-position="top"></div>
                            <div className={style.menubar} data-position="bottom"></div>
                        </div>
                    </div>
                    <div className={style.menucopy}>
                        <p>Menu</p>
                    </div>
                </div>
            </div>
            <AnimatePresence mode='wait'>
                <NavBar isOpen={isOpen} onClick={toggleMenu} />
            </AnimatePresence>
        </>
    )
}

export default Header;