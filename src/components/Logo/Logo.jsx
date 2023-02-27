import React from "react";
import './Logo.css'
import logosvg from '../../assets/logo-fotito.svg'


const Logo = () => {
    return(
        <header>
            <img 
            src={logosvg}
            alt="Logo Fotito"
            title="La fotito que necesitás"
            className="logo"/>
        </header>
    )
}

export { Logo }