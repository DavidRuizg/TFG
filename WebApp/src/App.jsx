import { useState } from 'react';
import { VertMenu } from './VertMenu';
import { Panel } from './Panel';
import { MenuButton } from './MenuButton';

import './VertMenu.css'
import './Panel.css';
import './MenuButton.css';

// Función que define el componente principal de la aplicación
export function App() {
  // Definición de los estados que puede tomar el panel principal (Vistas: Inicio, Servicios, Acerca de) con el estado inicial 'Inicio'
  const [currentView, setCurrentView] = useState('Inicio'); 
  // Definición del estado que indica si el menú vertical está mostrándose o no, con el estado inicial 'true'
  const [isShown, setIsShown] = useState(true);
  // Función que cambia la vista del panel principal
  const handleMenuClick = (view) => { 
    console.log(`Changing view to: ${view}`);
    setCurrentView(view);
  }
  // Función que cambia el estado del menú vertical de mostrarse a ocultarse y viceversa
  const handleButtonClick = () => {
    setIsShown(!isShown);
  }
  // Definición de las clases CSS que se aplicarán al menú vertical y al panel principal dependiendo del estado del menú vertical
  const menuView = isShown ? 'VertMenu' : 'VertMenu hide';
  const panelView = isShown ? 'Panel' : 'Panel expand';
  // Renderización de los componentes que forman la aplicación: Menú vertical, botón para ocultar el menú y panel principal
  return (
    <article className='App'>
        <VertMenu onClick={handleMenuClick} menuView={menuView}/>
        <MenuButton onClick={handleButtonClick}/>
        <Panel currentView={currentView} panelView={panelView}/>
    </article>
  )
}