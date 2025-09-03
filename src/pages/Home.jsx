import React, { useEffect, useLayoutEffect, useState } from 'react';
import '../pages/Home.scss';
import * as THREE from 'three';
import { vertexShader, fluidShader, displayShader } from './shaders.js'
import logo from '../assets/logo/ES.png'
import Description from './Description.jsx'
import Works from './Works.jsx';
import Preloader from "../common/preloader/preloader.jsx";
import { AnimatePresence } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { useGSAP } from '@gsap/react';
import { logoData } from './logo.js';

gsap.registerPlugin(ScrollTrigger);
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (
            async () => {
                const LocomotiveScroll = (await import('locomotive-scroll')).default
                const locomotiveScroll = new LocomotiveScroll();
                setTimeout(() => {
                    setIsLoading(false);
                    document.body.style.cursor = 'default'
                    window.scrollTo(0, 0);
                }, 2000)
            }
        )()
    }, [])

    const config = {
        brushSize: 25.0,
        brushStrength: 0.5,
        distortionAmount: 2.5,
        fluidDecay: 0.98,
        trailLength: 0.8,
        stopDecay: 0.85,

        Color1: "#b8fff7", // Verde petróleo MUY oscuro (base)
        Color2: "#6e3466", // Verde profundo elegante
        Color3: "#0133ff", // Verde aqua intermedio
        Color4: "#66d1fe", // Aqua más brillante

        colorIntensity: 1.0, // Bajamos un poco para evitar quemado
        softness: 1.0
    }

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const fluidTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
    })

    const fluidTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
    })

    let currentFluidTarget = fluidTarget1;
    let previousFluidTarget = fluidTarget2;
    let frameCount = 0;

    const fluidMaterial = new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
            iFrame: { value: 0 },
            iPreviousFrame: { value: null },
            uBrushSize: { value: config.brushSize },
            uBrushStrength: { value: config.brushStrength },
            uFluidDecay: { value: config.fluidDecay },
            uTrailLength: { value: config.trailLength },
            uStopDecay: { value: config.stopDecay },
        },
        vertexShader: vertexShader,
        fragmentShader: fluidShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 1 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            iFluid: { value: null },
            uDistortionAmount: { value: config.distortionAmount },
            uColor1: { value: new THREE.Color(config.Color1) },
            uColor2: { value: new THREE.Color(config.Color2) },
            uColor3: { value: new THREE.Color(config.Color3) },
            uColor4: { value: new THREE.Color(config.Color4) },
            uColorIntensity: { value: config.colorIntensity },
            uSoftness: { value: config.softness },
        },
        vertexShader: vertexShader,
        fragmentShader: displayShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
    const displayPlane = new THREE.Mesh(geometry, displayMaterial);

    let mouseX = 0, mouseY = 0;
    let prevMouseX = 0, prevMouseY = 0;
    let lastMoveTime = 0;

    function animate() {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.001;
        fluidMaterial.uniforms.iTime.value = time;
        displayMaterial.uniforms.iTime.value = time;
        fluidMaterial.uniforms.iFrame.value = frameCount;

        if (performance.now() - lastMoveTime > 100) {
            fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
        }

        fluidMaterial.uniforms.uBrushSize.value = config.brushSize;
        fluidMaterial.uniforms.uBrushStrength.value = config.brushStrength;
        fluidMaterial.uniforms.uFluidDecay.value = config.fluidDecay;
        fluidMaterial.uniforms.uTrailLength.value = config.trailLength;
        fluidMaterial.uniforms.uStopDecay.value = config.stopDecay;

        displayMaterial.uniforms.uColor1.value.set(config.Color1);
        displayMaterial.uniforms.uColor2.value.set(config.Color2);
        displayMaterial.uniforms.uColor3.value.set(config.Color3);
        displayMaterial.uniforms.uColor4.value.set(config.Color4);

        fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
        renderer.setRenderTarget(currentFluidTarget);
        renderer.render(fluidPlane, camera);

        displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
        renderer.setRenderTarget(null);
        renderer.render(displayPlane, camera);

        const temp = currentFluidTarget;
        currentFluidTarget = previousFluidTarget;
        previousFluidTarget = temp;

        frameCount++;

    }


    useLayoutEffect(() => {
        const gradientCanvas = document.querySelector(".gradient-canvas")
        renderer.setSize(window.innerWidth, window.innerHeight);
        gradientCanvas.appendChild(renderer.domElement);

        document.addEventListener('mouseleave', (e) => {
            const rect = gradientCanvas.getBoundingClientRect();
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            mouseX = e.clientX - rect.left;
            mouseY = rect.heigth - (e.clientY - rect.top);
            lastMoveTime = performance.now();
            fluidMaterial.uniforms.iMouse.value.set(mouseX, mouseY, prevMouseX, prevMouseY);
        });

        document.addEventListener("mouseleave", () => {
            fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
        });

        window.addEventListener("resize", () => {
            const width = window.innerWidth;
            const heigth = window.innerHeight;

            renderer.setSize(width, heigth);
            fluidMaterial.uniforms.iResolution.value.set(width, heigth);
            displayMaterial.uniforms.iResolution.value.set(width, heigth);

            fluidTarget1.setSize(width, heigth);
            fluidTarget2.setSize(width, heigth);
            frameCount = 0;
        });

        animate()
    }, [])



    useEffect(() => {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        const heroImgContainer = document.querySelector(".hero-img-container");
        const heroLogo = document.querySelector(".hero-logo");
        const heroImgCopy = document.querySelector(".hero-img-copy");
        const fadeOverlay = document.querySelector(".fade-overlay");
        const svgOverlay = document.querySelector(".overlay");
        const overlayCopy = document.querySelector(".overlay-copy h1");

        const initialOverlayScale = 350;
        const logoContainer = document.querySelector(".logo-container");
        const logoMask = document.getElementById("logoMask");
        console.log(logoMask)

        logoMask.setAttribute("d", logoData);

        const logoDimensions = logoContainer.getBoundingClientRect();
        const logoBoundingBox = logoMask.getBBox();

        const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;

        const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;

        const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);

        const logoHorizontalPosition = logoDimensions.left + (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 - logoBoundingBox.x * logoScaleFactor;

        const logoVerticalPosition = logoDimensions.top + (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 - logoBoundingBox.y * logoScaleFactor;

        console.log({
            horizontalScaleRatio,
            verticalScaleRatio,
            logoScaleFactor,
            logoHorizontalPosition,
            logoVerticalPosition
        });
        logoMask.setAttribute("transform", `translate(${logoHorizontalPosition}, ${logoVerticalPosition}) scale(${logoScaleFactor})`);

        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: `${window.innerHeight * 5}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                const scrollProgress = self.progress;
                const fadeOpacity = 1 - scrollProgress * (1 / 0.15);

                if (scrollProgress <= 0.15) {
                    gsap.set([heroLogo, heroImgCopy], {
                        opacity: fadeOpacity,
                    });
                } else {
                    gsap.set([heroLogo, heroImgCopy], {
                        opacity: 0,
                    });
                }

                if (scrollProgress <= 0.85) {
                    const normalizedProgress = scrollProgress * (1 / 0.85);
                    const heroImgContainerScale = 1.5 - 0.5 * normalizedProgress;
                    const overlayScale = initialOverlayScale * Math.pow(1 / initialOverlayScale, normalizedProgress);

                    let fadeOverlayOpacity = 0;

                    gsap.set(heroImgContainer, {
                        scale: heroImgContainerScale,
                    });

                    gsap.set(svgOverlay, {
                        scale: overlayScale,
                    });

                    if (scrollProgress >= 0.25) {
                        fadeOverlayOpacity = Math.min(1, (scrollProgress - 0.25) * (1 / 0.4));
                    }

                    gsap.set(fadeOverlay, {
                        opacity: fadeOverlayOpacity,
                    });
                }

                if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {
                    const overlayCopyRevealProgress = (scrollProgress - 0.6) * (1 / 0.25);

                    const gradientSpread = 100;
                    const gradientBottomPosition = 240 - overlayCopyRevealProgress * 280;
                    const gradientTopPosition = gradientBottomPosition - gradientSpread;
                    const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress;

                    overlayCopy.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #0133ff ${gradientBottomPosition}%, #fff 100%)`;
                    overlayCopy.style.backgroundClip = "text";

                    gsap.set(overlayCopy, {
                        scale: overlayCopyScale,
                        opacity: overlayCopyRevealProgress,
                    });
                } else if (scrollProgress < 0.6) {
                    gsap.set(overlayCopy, {
                        opacity: 0,
                    })
                }
            }
        })
    }, [])
    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && <Preloader />}
            </AnimatePresence>
            <section className="hero">
                <div className="hero-img-container">
                    <div className="gradient-canvas"></div>
                    <div className="hero-logo">
                        <img src={logo} alt="Logo de Edwin Santiago" />
                    </div>
                    <div className="hero-img-copy">
                        <p>▼ Deslice para ver contenido</p>
                    </div>

                    <div className="fade-overlay"></div>

                    <div className="overlay">
                        <svg width="100%" height="100%">
                            <defs>
                                <mask id="logoRevealMask">
                                    <rect width="100%" height="100%" fill="white" />
                                    <path id="logoMask" fill="black" d=" "/>
                                </mask>
                            </defs>
                            <rect width="100%" height="100%" fill="#111117" mask="url(#logoRevealMask)" />
                        </svg>
                    </div>

                    <div className="logo-container"></div>

                    <div className="overlay-copy">
                        <h1>Mi Nombre es Edwin Junior Santiago <br>
                        </br>Esto es Lo que hago como Ingeniero de Sistemas</h1>
                    </div>
                </div>
            </section>
            <section className="outro">
                <Description />
                <Works />
            </section>

        </>
    )
}
