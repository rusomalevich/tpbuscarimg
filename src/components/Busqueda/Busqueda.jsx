import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Masonry from 'react-masonry-css'
import './Busqueda.css'
import { Logo } from '../Logo/Logo'
import { Loader } from '../Loader/Loader'
import { BusquedaForm } from '../BusquedaForm/BusquedaForm'
import { BsFillTagFill, BsFillMapFill, BsFillPersonFill, BsFillCameraFill } from "react-icons/bs"
import LazyLoad from 'react-lazy-load'

const BASEurl = 'https://api.unsplash.com/'
const apiKey = 'htnGW05HKp9aqvSG7TeuzSrAt5BSWCRqhQzfjv04XOs'
const apiSearch = 'search/photos?query='
const cantidadFotos = '5'

const Busqueda = ({ params }) => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query")
    const [imagenes, setImagenes] = useState([])
    const [cargando, setCargando] = useState(false)
    const irA = useNavigate()
    const [pagina, setPagina] = useState(1);

    const buscarSubmit = async busqueda => {
        setCargando(true)
        const response = await axios.get(`${BASEurl}${apiSearch}${busqueda}&per_page=${cantidadFotos}&client_id=${apiKey}`)
        setImagenes(response.data.results)
        setCargando(false)
    }

    useEffect(() => {
        const traeImagenes = async () => {
            setCargando(true)
            const response = await axios.get(`${BASEurl}${apiSearch}${query}&per_page=${cantidadFotos}&client_id=${apiKey}`)
            setImagenes(response.data.results)
            setCargando(false)
        }

        traeImagenes()
    }, [query])

    const traeDatosFotoAPI = async id => {
        const response = await axios.get(`${BASEurl}photos/${id}?client_id=${apiKey}`)
        return response.data
    }

    const tagClick = tag => {
        irA(`/search?query=${encodeURIComponent(tag)}`)
    }

    useEffect(() => {
        const infinitoImagenes = async () => {
            setCargando(true)
            const response = await axios.get(`${BASEurl}${apiSearch}${query}&per_page=${cantidadFotos}&page=${pagina}&client_id=${apiKey}`)
            setImagenes(imagenes => [...imagenes, ...response.data.results]);
            setCargando(false)
        }

        infinitoImagenes()

    }, [query, pagina])

    const handleScroll = () => {
        const scrollPos = document.documentElement.scrollTop + window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        if (scrollPos >= scrollHeight && !cargando) {
            if(pagina<2){
                setPagina(pagina => pagina + 1); // cargar la siguiente página de imágenes
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                            <LazyLoad once>
                            <img
                                src={imagen.urls.small_s3}
                                alt={imagen.description}
                                className='foto' />
                            </LazyLoad>
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
                                        {datosFoto.tags.map((tag, index) =>
                                            index < 5 && (
                                            <a
                                                href='#'
                                                onClick={() => tagClick(tag.title)}
                                                className="etiqueta"
                                                key={`etiqueta${tag.title}${i}`}
                                                id={`etiqueta${tag.title}${i}`}>
                                                <BsFillTagFill />{tag.title}</a>))
                                            }

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
            <BusquedaForm onSearchSubmit={buscarSubmit} defaultValue={query} />
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {cargando ? <Loader /> : infoImg}
            </Masonry>
        </div>

    )
}

export { Busqueda }