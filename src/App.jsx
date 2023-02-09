import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const apiKey = 'kGS0Yw08xWCh64TiRy_U421UZRvGQhnmYWYuoIPWAs8'
  //const BASEurl = 'https://api.unsplash.com/photos/random/'
  const BASEurl = 'https://api.unsplash.com/'
  const apiSearch = 'search/photos/'
  const apiRandom = 'photos'
  const [imagenes, setImagenes]=useState([])
  const busquedaRef=useRef(null)
  const [busqueda, setBusqueda] = useState(null)

  
  useEffect(()=>{
    const obtenerImagenes=async ()=> {
      
      if(busqueda==null){
        const response = await axios.get(`${BASEurl}${apiRandom}?client_id=${apiKey}`)
        const propLimite = 'x-ratelimit-remaining'
        const limite = response.headers[propLimite]
        const datos = response.data
        setImagenes(datos)
        console.log(`${limite} consultas disponibles`)
        console.log(response)
      } else {
        const response = await axios.get(`${BASEurl}${apiSearch}?client_id=${apiKey}&query=${busqueda}`)
        const propLimite = 'x-ratelimit-remaining'
        const limite = response.headers[propLimite]
        const datos = response.data
        setImagenes(datos.results)
        console.log(`${limite} consultas disponibles`)
        console.log(response)
      }
    }
    obtenerImagenes()
  }, [busqueda])
    const buscar=()=>{
      console.log('buscar')
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
      <div>{imagenes.map((elemento) => 
        <div 
          key={elemento.id}>
            <img 
              src={elemento.urls.small_s3} 
              alt={elemento.alt_description} 
            />
            <p>{/*agregar condicional para que no renderice el P si no hay location*/}
              {elemento.user.location}
            </p>
        </div>
        )}
      </div>
    </div>
  )
}

export default App
