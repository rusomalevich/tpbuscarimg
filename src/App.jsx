import { useState } from 'react'
import './App.css'
import { Logo } from './components/Logo/Logo'
import { Busqueda } from "./components/Busqueda/Busqueda"
import { MuestraImagenes } from "./components/MuestraImagenes/MuestraImagenes"

const App = () => {

  const [busqueda, setBusqueda] = useState('');

  return (
    <div 
    className='container'>
      <Logo />
      <Busqueda setBusqueda={setBusqueda} />
      <MuestraImagenes busqueda={busqueda} />
    </div>
  )
}

export default App
