import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsSearch } from "react-icons/bs"

const BusquedaForm = ({ onSearchSubmit, tags }) => {
    const [busqueda, setBusqueda] = useState('')
    const irA = useNavigate()

    const buscarSubmit = event => {
        event.preventDefault()
        onSearchSubmit(busqueda)
        irA(`/search?query=${encodeURIComponent(busqueda)}`)
    }

    const buscaCambioInput = event => {
        setBusqueda(event.target.value)
    }

    return (
        <form
            onSubmit={buscarSubmit}
            className='buscador'>
            <input
                id="searchInput"
                type="search"
                name="busqueda"
                placeholder='Buscar imágenes'
                className='inputBuscar'
                value={busqueda}
                onChange={buscaCambioInput}
            />
            <button
                type="submit"
                className='botonBuscar'><BsSearch /></button>
            
        </form>
    )
}

export { BusquedaForm }