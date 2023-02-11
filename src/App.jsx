import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'
let idFotos=[]

function App() {

  const apiKey = 'kGS0Yw08xWCh64TiRy_U421UZRvGQhnmYWYuoIPWAs8'
  //const BASEurl = 'https://api.unsplash.com/photos/random/'
  const BASEurl = 'https://api.unsplash.com/'
  const apiSearch = 'search/photos/'
  const cantidadFotos = 9
  const apiRandom = 'photos/random?count='//https://api.unsplash.com/photos/random?count=5
  const [imagenes, setImagenes]=useState([])
  const busquedaRef=useRef(null)
  const [busqueda, setBusqueda] = useState(null)
  const [modeloCamara, setModeloCamara] = useState([])


  useEffect(()=>{
    const obtenerImagenes=async ()=> {
      
      if(busqueda==null){
        const response = await axios.get(`${BASEurl}${apiRandom}${cantidadFotos}&client_id=${apiKey}`)
        //con RANDOM funciona el COUNT y trae el EXIF, sino no
        const propLimite = 'x-ratelimit-remaining'
        const limite = response.headers[propLimite]
        const datos = response.data
        setImagenes(datos)
        console.log(response)
        console.log(`${limite} consultas disponibles`)
      } else {
        const response = await axios.get(`${BASEurl}${apiSearch}?query=${busqueda}&per_page=2&client_id=${apiKey}`)
        const propLimite = 'x-ratelimit-remaining'
        const limite = response.headers[propLimite]
        const datos = response.data
        setImagenes(datos.results)
        console.log(response)
        console.log(`${limite} consultas disponibles`)
        
        idFotos = datos.results.map((elemento) => elemento.id)
        if (idFotos){
          idFotos.forEach(async idFoto => {
            const responseFoto = await axios.get(`${BASEurl}photos/${idFoto}/?client_id=${apiKey}`)
            modeloCamara.push(responseFoto.data.exif.model)
          });
        }
      }
    }
    obtenerImagenes()
  }, [busqueda])
    const buscar=()=>{
      setBusqueda(busquedaRef.current.value)
    }

  return (
    <div>
      <h1>Holus</h1>
      <input
        ref={busquedaRef}
        type='search'
        placeholder='Buscar imágenes'
        name='buscar'
        />
      <button onClick={() => buscar()}>Buscar</button>
      <div>{imagenes.map((elemento, index) => 
        <div 
          key={elemento.id}
          id={elemento.id}
          >
            <img 
              src={elemento.urls.small_s3} 
              alt={elemento.alt_description} 
            />
          {/*Si hay ubicación, la muestra*/}
          {(elemento.user.location?
            (<span>{elemento.user.location}</span>)
            :null)}
          {(busqueda==null)?
            (<span>{elemento.exif.make} {elemento.exif.model}</span>)
            : (<span>{modeloCamara[index]}</span>)}
        </div>
        )}
      </div>
    </div>
  )
}

export default App
