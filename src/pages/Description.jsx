import { useInView , motion } from "framer-motion";
import { useRef } from "react";
import { slideUp, opacity } from './animation';
import Rounded from '../common/rounded/Rounded';
import { Link } from "react-router-dom";
import './Description.scss'

export default function Description() {
    const frase = "Implementando soluciones del mundo digital a problemas reales. Todo desde un enfoque creativo y diferente. Poniendo la calidad como prioridad ante todo.";
    const description = useRef(null);
    const isInView = useInView(description)

    return (
        <div ref={description} className="description">
            <div className="body">
                <p>
                    {
                        frase.split(" ").map( (word, index) => {
                            return <span key={index} className="mask"><motion.span variants={slideUp} custom={index} animate={isInView ? "open": "closed"} key={index}>{word}</motion.span></span>
                        })
                    }
                </p>
                <motion.p variants={opacity} animate={isInView ? "open": "closed"}>Creando soluciones unicas e inovadoras, destaco entre los demas por mi poder creativo.</motion.p>
                <div data-scroll data-scroll-speed={0.1}>
                    <Rounded className="button">
                        <Link to="/about" className="font">Ven Conoce Más !</Link>
                    </Rounded>                    
                </div>
            </div>
        </div>
    )
}