import { useState } from 'react'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import Temp from './pages/Temp'

function App() {

  return (
      <div className='bg-slate-700 min-h-dvh text-white'>
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/home' element={<Home />}/>
            <Route path='/temp' element={<Temp />}/>
          </Routes>
        </Router>
      </div> 
    
  )
}

export default App
