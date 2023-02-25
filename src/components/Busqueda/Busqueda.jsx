import React from "react"
import './Busqueda.css'
import { BsSearch } from "react-icons/bs"

const Busqueda = ({ setBusqueda }, tag) => {
    console.log(tag)
    const buscar = e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const busqueda = formData.get('busqueda')
        setBusqueda(busqueda)
    };

    return (
        <form
            onSubmit={buscar}
            className='buscador'
            
        >
            <input
                type="search"
                name="busqueda"
                placeholder='Buscar imágenes'
                className='inputBuscar'
            />
            <button
                type="submit"
                className='botonBuscar'
            ><BsSearch /></button>
        </form>
    );
};

export {Busqueda}