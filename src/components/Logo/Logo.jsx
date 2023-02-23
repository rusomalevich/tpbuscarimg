import React from "react";
import './Logo.css'

const Logo = () => {
    return(
        <header>
            <img 
            src='./src/assets/logo-fotito.svg'
            alt="Logo Fotito"
            title="La fotito que necesitás"
            className="logo"/>
        </header>
    )
}

export { Logo }