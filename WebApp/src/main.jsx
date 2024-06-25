import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'

import './index.css'
import './App.css'

// Creación de la raíz del árbol de componentes
const root = ReactDOM.createRoot(document.getElementById('root'))

// Renderizado del componente aplicación
root.render(
  <App />
)