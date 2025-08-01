import proyecto_1 from "../assets/GreenEnergy.webp";
import proyecto_2 from "../assets/medihelp.webp";
import proyecto_3 from "../assets/eduflex.webp"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis"
import "./Works.scss"
import { useEffect } from "react";

export default function Works() {
    const data = [
        {
            id: 1,
            image: proyecto_1,
            title: "Green Energy Solutions"
        },
        {
            id: 2,
            image: proyecto_2,
            title: "MediHelp"
        },
        {
            id: 3,
            image: proyecto_3,
            title: "EduFlex"

        }


    ]
    
    useEffect(() => {
        const lenis = new Lenis()

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        const proyects = gsap.utils.toArray(".proyect")
        const observeOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        }

        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting){
                    const proyect = entry.target;
                    const imgContainer = proyect.querySelector(".img");

                    ScrollTrigger.create({
                        trigger: proyect,
                        start: "bottom bottom",
                        end: "top top",
                        scrub: true,
                        onUpdate: (self) => {
                            let progress = self.progress;
                            let newWidth = 30 + 70 * progress;
                            gsap.to(imgContainer, {
                                width: newWidth + "%",
                                duration: 0.1,
                                ease: "none",
                            });
                        },
                    })

                    ScrollTrigger.create({
                        trigger: proyect,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                        onUpdate: (self) => {
                            let progress = self.progress;
                            let newHeigth = 150 + 300 * progress;
                            gsap.to(proyect, {
                                height: newHeigth + "px",
                                duration: 0.1,
                                ease: "none",
                            })
                        }
                    })
                    observer.unobserve(proyect);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observeOptions);

        proyects.forEach((proyect) => {
            observer.observe(proyect)
        })
    }, [])

    

    return (
        <>
            <section className="proyects">
                <div className="proyects-header">
                    <div className="col"></div>
                    <div className="col">
                        <h1>Proyectos</h1>
                    </div>
                </div>
                {data.map((proyecto, i) => {
                    return <div className="proyect" key={i}>
                        <div className="proyect-info">
                            <h1>{proyecto.title}</h1>
                        </div>
                        <div className="proyect-img">
                            <div className="img">
                                <img src={proyecto.image} alt="" />
                            </div>
                        </div>
                    </div>
                })}
            </section>
        </>
    )
}