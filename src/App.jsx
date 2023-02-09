import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const apiKey = 'kGS0Yw08xWCh64TiRy_U421UZRvGQhnmYWYuoIPWAs8'
  const BASEurl = 'https://api.unsplash.com/search/photos/'
  const [imagenes, setImagenes]=useState([])
  const busquedaRef=useRef(null)
  const [busqueda, setBusqueda] = useState('search')

  
  useEffect(()=>{
    const obtenerImagenes=async ()=> {
      //const response = await axios.get(`${BASEurl}?client_id=${apiKey}&query=keyboards`)
      const response = await axios.get(`${BASEurl}?client_id=${apiKey}&query=${busqueda}`)
      const propLimite = 'x-ratelimit-remaining'
      const limite = response.headers[propLimite]
      console.log(`${limite} consultas disponibles`)
      const datos=response.data
      console.log(response)
      setImagenes(datos.results)
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
      <div>{imagenes.map((elemento) => <img key={elemento.id} src={elemento.urls.small_s3} alt={elemento.alt_description} />)}</div>
    </div>
  )
}

export default App
