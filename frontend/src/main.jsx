import React from 'react'
import ReactDOM from 'react-dom/client'
import {Auth} from "./context/Auth.jsx"
import App from './App.jsx'
import './index.css'
import { Vaults } from './context/Vaults.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Auth>
      <Vaults>
        <App />
      </Vaults>
    </Auth>
  //  </React.StrictMode>,
)
