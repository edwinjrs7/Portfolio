import React, { useState, useRef, useEffect } from "react"
import { Link, BrowserRouter, Route, Routes } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import CustomEase from "gsap/CustomEase"
import './MenuBar.css'

gsap.registerPlugin(CustomEase)
CustomEase.create(
    "hop",
    "M0, 0 C0.354, 0 0.464, 0.133 0.498, 0.502 0.532, 0.872 0.651, 1 1,1"
);

const MenuLinks = [
    { path: "/", label: "Inicio" },
    { path: "/about", label: "Sobre Mi" },
    { path: "/projects", label: "Proyectos" },
    { path: "/services", label: "Servicios" },
    { path: "/contact", label: "Contactos" }

]

export const NavBar = ({isOpen, toggleMenu}) => {

    const menuToggleRef = useRef(null)
    const menuRef = useRef(null)
    const [isAnimating, setIsAnimating] = useState(false)
    

    

    useEffect(() => {
        gsap.to(menuRef.current, {
            clipPath: "polygon(0%, 100%, 100% 100%, 100% 100%, 0% 100%)"
        })

        if(isOpen){
            document.body.style.overflow = "hidden";
        }else{
            document.body.style.overflow = "";
        }
       
    }, [isOpen])

    useGSAP(() => {
        if (isAnimating) return;

        if (isOpen) {
            setIsAnimating(true)

            gsap.to(menuRef.current, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: "hop",
                duration: 1.5,
                onStart: () => {
                    menuRef.current.style.pointerEvents = 'all';
                },
                onComplete: () => {
                    setIsAnimating(false);
                }
            });

            gsap.to(".link", {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                delay: 0.85,
                duration: 1,
                ease: "power3.out",
            });

            gsap.to(".socials p", {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                delay: 0.85,
                duration: 1,
                ease: "power3.out",
            });

            gsap.to(".header h1 span", {
                rotateY: 0,
                stagger: 0.05,
                delay: 0.85,
                duration: 1,
                ease: "power4.out",
            });

            gsap.to(".header h1 span", {
                y: 0,
                scale: 1,
                stagger: 0.05,
                delay: 0.85,
                duration: 1,
                ease: "power4.out",
            });



        } else {
            setIsAnimating(true)

            gsap.to(menuRef.current, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0% , 0% 0%)",
                ease: "hop",
                duration: 1.5,
                onComplete: () => {
                    menuRef.current.style.pointerEvents = 'none';
                    gsap.set(menuRef.current, {
                        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
                    }),

                    gsap.set(".link", { y: 30, opacity: 0 });
                    gsap.set(".socials p", { y: 30, opacity: 0 });
                    gsap.set(".header h1 span", {
                        y: 500,
                        scale: 0.1,
                        rotateY: 80,
                    });

                    setIsAnimating(false);
                },
            });
        }

    }, [isOpen])

 
    return (
        <>
            <div className="menu" ref={menuRef}>
                <div className="col col-1">
                    <div className="menu-logo" onClick={toggleMenu}><Link to="/">Edwin</Link></div>
                    <div className="links" onClick={toggleMenu}>
                        {MenuLinks.map((link, index) => (
                            <div className="link" key={index}>
                                <Link to={link.path}>{link.label}</Link>
                            </div>
                        ))}
                    </div>

                </div>
                <div className="col col-2">
                    <div className="socials">
                        <div className="sub-col">
                            <p>Edwin Junior Santiago</p>
                            <p>Ingeniero de Sistemas</p>
                            <p>Desarrollador FullStack</p>
                            <p>Colombia</p>
                        </div>
                        <div className="sub-col">
                            <p>Instagram</p>
                            <p>LinkedIn</p>
                            <p>GitHub</p>
                            <p>Whatsapp</p>
                        </div>
                    </div>
                    <div className="header">
                        <h1>{"Junior".split("").map((char, i) => (
                            <span key={i}>{char === " " ? "\u00A0\u00A0" : char}</span>
                        ))}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}