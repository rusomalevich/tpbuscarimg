import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'
import Masonry from 'react-masonry-css'
import { BsSearch, BsFillTagFill, BsFillMapFill, BsFillPersonFill } from "react-icons/bs";
import { Logo } from './components/Logo/Logo'

let idFotos=[]

function App() {

  const apiKey = 'kGS0Yw08xWCh64TiRy_U421UZRvGQhnmYWYuoIPWAs8'
  //const BASEurl = 'https://api.unsplash.com/photos/random/'
  const BASEurl = 'https://api.unsplash.com/'
  const apiSearch = 'search/photos/'
  const cantidadFotos = 'count=5'
  const apiRandom = 'photos/random?'//https://api.unsplash.com/photos/random?count=5
  const [imagenes, setImagenes] = useState([])
  const busquedaRef = useRef(null)
  const [busqueda, setBusqueda] = useState(null)
  const [modeloCamara, setModeloCamara] = useState([])

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    700: 1
  };

  useEffect(()=>{
    const obtenerImagenes=async ()=> {
      let datos = []
      if(busqueda == null){
        //const response = await axios.get(`${BASEurl}${apiRandom}${cantidadFotos}&client_id=${apiKey}`)
        //con RANDOM  trae el EXIF, sino no
        const response = await axios.get(`${BASEurl}${apiSearch}?query=vintage&client_id=${apiKey}`)
        const propLimite = 'x-ratelimit-remaining'
        const limite = response.headers[propLimite]
        //datos = response.data
        datos = response.data.results
        //setImagenes(datos)
        console.log(response)
        console.log(`${limite} consultas disponibles`)
      } else {
        //AGREGUÉ QUE SÓLO TRAIGA 2 POR BÚSQUEDA PARA AHORRAR CONSULTAS PORQUE EL EXIF NO VIENE EN EL ARRAY DE OBJETOS CUANDO SE BUSCA SINO EN EL ARRAY DE OBJETOS DE CUANDO SE TRAE CADA FOTO
        const response = await axios.get(`${BASEurl}${apiSearch}?query=${busqueda}&per_page=2&client_id=${apiKey}`)
        const propLimite = 'x-ratelimit-remaining'
        const limite = response.headers[propLimite]
        datos = response.data.results
        console.log(response)
        console.log(`${limite} consultas disponibles`)
        
        idFotos = datos.map((elemento) => elemento.id)

        //Esto borra modeloCamara
        //modeloCamara.length=0

        /*ESTO DE ABAJO FUNCIONA PERO NO LA PRIMERA VEZ*/
        //Puse 2 porque es la cantidad de páginas que usaba
        if (modeloCamara.length >= 2){
          modeloCamara.length = 0
          }
          idFotos.forEach(async idFoto => {
            const responseFoto = await axios.get(`${BASEurl}photos/${idFoto}/?client_id=${apiKey}`)
            modeloCamara.push(responseFoto.data.exif.model)
          })
        console.log(modeloCamara)
        
      }
      setModeloCamara(modeloCamara)
      setImagenes(datos)
    }
    obtenerImagenes()
  }, [busqueda])


    const buscar=(tag)=>{
      if (tag) {
        setBusqueda(tag)

      } else if (busquedaRef.current.value != ''){
        setBusqueda(busquedaRef.current.value)
      }
      console.log(busqueda)
    }

  const [bgColor, setbgColor] = useState(null);
  
  const handleMouseEnter = (imgColor) => {
    setbgColor(imgColor)
    document.body.style.background = imgColor;
  };
  const handleMouseLeave = () => {
    document.body.style.background = "var(--gris)";
  };



  return (
    <div 
      className='container'
      >

      < Logo />
      <div className='buscador'>
        <input
          ref={busquedaRef}
          type='search'
          placeholder='Buscar imágenes'
          name='buscar'
          className='inputBuscar'
          />
        <button 
          className='botonBuscar'
          onClick={() => buscar()}
        ><BsSearch/></button>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        
      
      {imagenes.map((elemento, index) =>
        <div
          key={elemento.id}
          id={elemento.id}
          className='card'
          onMouseEnter={() => handleMouseEnter(elemento.color)}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={elemento.urls.small_s3}
            alt={elemento.alt_description}
            className="foto"
          />
          <div
            className='datosFoto'
          >
          {/*Si hay ubicación, la muestra*/}
            <div
              className='propiedades etiquetas'
            >
              {elemento.tags.map((etiqueta, i) =>
                <a
                  key={`${elemento.user.id}${i}`}
                  href='#'
                  onClick={() => buscar(etiqueta.title)}
                  className="etiqueta">
                  <BsFillTagFill/>
                  {etiqueta.title}</a>
              )}
            </div>
          {(
            elemento.user.location ?
            (<div className='propiedades'>
                  <BsFillMapFill/> {elemento.user.location}
            </div>)
            : null)
          }
          {/*(busqueda == null) ?
            (<span>{elemento.exif.make} {elemento.exif.model}</span>)
        : (<span>{modeloCamara[index]}</span>)*/}
            <div
              className='propiedades'>
                <p>
                  <a 
                    href={elemento.user.links.html}
                    target='_blank'
                    className='creditos'
                    title={`Ver más de ${elemento.user.first_name} ${elemento.user.last_name}`}
                  >
                  <BsFillPersonFill /> {elemento.user.first_name} {elemento.user.last_name}</a> /
                  <a 
                    href='https://unsplash.com/es' 
                    title='Ir a Unsplash' 
                    target='_blank'
                    className='creditos'
                  >Unsplash</a>
                </p>
            </div>
          </div>
        </div>
      )}
      </Masonry>

    </div>
  )
}

export default App
