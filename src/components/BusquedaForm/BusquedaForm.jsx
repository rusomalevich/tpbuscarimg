import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BsSearch } from "react-icons/bs"

const BusquedaForm = ({ onSearchSubmit, tags }) => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query")
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
                defaultValue={query}
                onChange={buscaCambioInput}
            />
            <button
                type="submit"
                className='botonBuscar'><BsSearch /></button>
            
        </form>
    )
}

export { BusquedaForm }