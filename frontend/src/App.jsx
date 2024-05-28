import { useState } from 'react'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import Temp from './pages/Temp'
import PrivateRoute from './pages/PrivateRoute'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'

function App() {

  return (
      <div className='bg-gradient-to-r from-slate-900 to-slate-800 min-h-dvh text-white'>
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route element={<PrivateRoute />}>
              <Route path='/home' element={<Home />} />
                <Route path='/dashboard/:id' element = {<Dashboard />} />
              <Route path='/temp' element={<Temp />}/>
            </Route>
          </Routes>
        </Router>
      </div> 
    
  )
}

export default App
