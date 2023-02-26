import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Masonry from 'react-masonry-css'
import './Busqueda.css'
import { Logo } from '../Logo/Logo'
import { BusquedaForm } from '../BusquedaForm/BusquedaForm'
import { BsFillTagFill, BsFillMapFill, BsFillPersonFill, BsFillCameraFill } from "react-icons/bs"

const BASEurl = 'https://api.unsplash.com/'
const apiKey = 'kGS0Yw08xWCh64TiRy_U421UZRvGQhnmYWYuoIPWAs8'
const apiSearch = 'search/photos?query='
const apiRandom = 'photos/random?'//https://api.unsplash.com/photos/random?count=5
const cantidadFotos = '2'

const Busqueda = ({ params }) => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query")
    const [imagenes, setImagenes] = useState([])
    const [cargando, setCargando] = useState(false)
    const irA = useNavigate()

    const buscarSubmit = async busqueda => {
        setCargando(true)
        //const response = await axios.get(`https://api.unsplash.com/search/photos?query=${busqueda}&client_id=YOUR_ACCESS_KEY`)
        const response = await axios.get(
            `${BASEurl}${apiSearch}${busqueda}&per_page=${cantidadFotos}&client_id=${apiKey}`
        )
        setImagenes(response.data.results)
        setCargando(false)
        const propLimite = 'x-ratelimit-remaining'
        const limite = response.headers[propLimite]
        console.log(`${limite} consultas disponibles`)
    }

    useEffect(() => {
        const traeImagenes = async () => {
            setCargando(true)
            //const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_ACCESS_KEY`)
            const response = await axios.get(`${BASEurl}${apiSearch}${query}&per_page=${cantidadFotos}&client_id=${apiKey}`)
            setImagenes(response.data.results)
            setCargando(false)
            const propLimite = 'x-ratelimit-remaining'
            const limite = response.headers[propLimite]
            console.log(`${limite} consultas disponibles`)
        }

        traeImagenes()
    }, [query])

    const traeDatosFotoAPI = async id => {
        const response = await axios.get(`${BASEurl}photos/${id}?client_id=${apiKey}`)
        return response.data
    }

    const handleTagClick = tag => {
        irA(`/search?query=${encodeURIComponent(tag)}`)
    }


    const handleMouseEnter = (imgColor) => {
        document.body.style.background = imgColor
    }
    const handleMouseLeave = () => {
        document.body.style.background = "var(--gris)"
    }

    const breakpointColumnsObj = {
        default: 4,
        1200: 3,
        900: 2,
        700: 1
    }

    useEffect(() => {
        const traeDatosFoto = async () => {
            const infoImg = await Promise.all(
                imagenes.map(async (imagen, i) => {
                    const datosFoto = await traeDatosFotoAPI(imagen.id)

                    return (
                        <div
                            key={imagen.id}
                            id={imagen.id}
                            className='card'
                            onMouseEnter={() => handleMouseEnter(imagen.color)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={imagen.urls.small_s3}
                                alt={imagen.description}
                                className='foto' />
                            <div
                                className="datosFoto">
                                {imagen.user.location && (<div
                                    className="propiedades">
                                    <p><BsFillMapFill /> {imagen.user.location}</p>
                                </div>
                                )}
                                {datosFoto.exif && datosFoto.exif.model && (
                                    <div
                                        className="propiedades">
                                        <p><BsFillCameraFill />{datosFoto.exif.model}</p>
                                    </div>
                                )}
                                {imagen.user.first_name && imagen.user.last_name && (
                                    <div
                                        className="propiedades"
                                    >
                                        <p><a
                                            href={imagen.user.links.html}
                                            target='_blank'
                                            className='creditos'
                                            title={`Ver más de ${imagen.user.first_name} ${imagen.user.last_name}`}
                                        >
                                            <BsFillPersonFill /> {imagen.user.first_name} {imagen.user.last_name}</a> /
                                            <a
                                                href='https://unsplash.com/es'
                                                title='Ir a Unsplash'
                                                target='_blank'
                                                className='creditos'
                                            >Unsplash</a></p>
                                    </div>
                                )}
                                {datosFoto.tags.length > 0 && (
                                    <div
                                        className="propiedades etiquetas">
                                        {datosFoto.tags.map(tag =>
                                            <a
                                                href='#'
                                                onClick={() => handleTagClick(tag.title)}
                                                className="etiqueta"
                                                key={`etiqueta${tag.title}${i}`}
                                                id={`etiqueta${tag.title}${i}`}>
                                                <BsFillTagFill />{tag.title}</a>)}

                                    </div>
                                )}
                            </div>
                        </div>
                    )

                })
            )
            return infoImg
        }


        if (imagenes.length > 0) {
            traeDatosFoto().then(infoImg => {
                setinfoImg(infoImg)
            })
        }
    }, [imagenes])

    const [infoImg, setinfoImg] = useState([])

    return (
        <div className='container'>
            <Logo />
            <BusquedaForm onSearchSubmit={buscarSubmit} />
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {cargando ? <p> cargando...</p> : infoImg}
            </Masonry>
        </div>

    )
}

export { Busqueda }