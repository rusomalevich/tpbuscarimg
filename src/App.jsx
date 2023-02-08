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
      console.log(response)
    }
    obtenerImagenes()
  }

  )

  return (
    <div>
      <h1>Holus</h1>
    </div>
  )
}

export default App
