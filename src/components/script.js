import gsap from "gsap"
import { useGSAP } from '@gsap/react'

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
        "hop",
        "M0, 0 C0.354, 0 0.464, 0.133 0.498, 0.502 0.532, 0.872 0.651, 1 1,1"
    );

    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const links = document.querySelectorAll('.link');
    const socials = document.querySelectorAll('.socials a');
    let isAnimating = false;

    const splitTextIntoSpans = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            const text = element.innerText;
            const splitText = text
                .split("")
                .map(char => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`)
                .join("");
            element.innerHTML = splitText;
        });
    };
    splitTextIntoSpans(".header h1");

    menuToggle.addEventListener('click', () => {
       if (isAnimating) return;

       if(menuToggle.classList.contains('closed')) {
           menuToggle.classList.remove('closed');
           menuToggle.classList.add('opened');

           isAnimating = true;

           gsap.to(menu, {
               clipPath: "polygon(0%, 100%, 100% 100%, 100% 100%, 0% 100%)",
               ease: "hop",
               duration: 1.5,
               onStart: () => {
                menu.computedStyleMap.pointerEvents = 'all';
               },
               onComplete: () => {
                   isAnimating = false;
                },

                
            });
            gsap.to(links, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                delay: 0.85,
                duration: 1,
                ease: "power3.out",
            });

            gsap.to(socials, {
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
                delay: 0.75,
                duration: 1.5,
                ease: "power4.out",
            });

            gsap.to(".header h1 span", {
                y: 0,
                scale: 1,
                stagger: 0.05,
                delay: 0.75,
                duration: 1.5,
                ease: "power4.out",
            });

       }else{
            menuToggle.classList.remove('opened');
            menuToggle.classList.add('closed');
            isAnimating = true;

            gsap.to(menu, {
                clipPath: "polygon(0%, 100%, 100% 100%, 100% 100%, 0% 100%)",
                ease: "hop",
                duration: 1.5,
                onComplete: () => {
                    menu.computedStyleMap.pointerEvents = 'none';
                    gsap.set(menu, {
                        clipPath: "polygon(0%, 100%, 100% 100%, 100% 100%, 0% 100%)",
                    })

                    gsap.set(links, { y: 30, opacity: 0 });
                    gsap.set(socials, { y: 30, opacity: 0 });
                    gsap.set(".header h1 span", {
                        y: 500,
                        rotateY: 90,
                        scale: 0.75,
                    });
                    isAnimating = false;
                },
            })
       }
       
    });
})