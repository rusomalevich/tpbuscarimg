import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const apiKey = 'kGS0Yw08xWCh64TiRy_U421UZRvGQhnmYWYuoIPWAs8'
  const BASEurl = 'https://api.unsplash.com/search/photos/'
  const [imagenes, setImagenes]=useState([])
  const busqueda = 'keyboards'
  
  useEffect(()=>{
    const obtenerImagenes=async ()=> {
      const response = await axios.get(`${BASEurl}?client_id=${apiKey}&query=${busqueda}`)
      const datos=response.data
      setImagenes(datos.results)
    }
    obtenerImagenes()
  }, []
    
  )

  return (
    <div>
      <h1>Holus</h1>
      {imagenes.map((elemento) => <h2>{elemento.alt_description}</h2>)}
    </div>
  )
}

export default App
