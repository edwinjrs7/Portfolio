import react, { useEffect, useRef } from "react"
import style from "./footer.module.scss";
import { Mail, Github, Linkedin, Instagram, ArrowUpRight, MessageCircle } from "lucide-react"
import { href } from "react-router-dom";
import Magnetic from "../common/magnetic/Magnetic";
export default function Footer() {
    const socialsLinks = [
        {
            icon: Github,
            href: "https://github.com/edwinjrs7",
            label: "GitHub"
        },
        {
            icon: Linkedin,
            href: "www.linkedin.com/in/edwin-junior-santiago",
            label: "LinkedIn"
        },
        {
            icon: Instagram,
            href: "",
            label: "Instagram",

        },
        {
            icon: MessageCircle,
            href: "",
            label: "WhatsApp",
        }
    ]
    return (
        <>
            <footer className={style.footer}>
                <div className={style.container}>
                    <div className={style.mainContent}>
                        <div className={style.grid}>
                            <div className={style.leftSection}>
                                <h2 className={style.title}>Trabajemos juntos</h2>
                                <p className={style.description}>Siempre abierto a
                                    nuevos proyectos y colaboraciones interesantes.
                                </p>

                                <div>
                                    <a href="mailto:edwin.santiago2003@hotmail.com" className={style.contactLink}>
                                        <Mail className={style.mailIcon} />
                                        <span>edwin.santiago2003@hotmail.com</span>
                                        <ArrowUpRight className="arrowIcon"></ArrowUpRight>
                                    </a>
                                </div>
                            </div>
                            <div className={style.rightSection}>
                                <h3 className={style.socialTitle}>Sígueme</h3>
                                <div className={style.socialLinks}>
                                    {socialsLinks.map((social, index) => (
                                        <Magnetic>
                                            <a key={index} href={social.href} className={style.socialIcon} aria-label={social.label}>
                                                <div className={style.iconWrapper}>
                                                    <social.icon className={style.icon} />
                                                </div>
                                            </a>
                                        </Magnetic>

                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}