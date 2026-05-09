
import './App.css'
import { Home } from './home'
import { Login } from './login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Perfil } from './perfil'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/perfil' element={<Perfil />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
