import { useState } from 'react';
import { VertMenu } from './VertMenu';
import { Panel } from './Panel';
import { MenuButton } from './MenuButton';

import './VertMenu.css'
import './Panel.css';
import './MenuButton.css';

export function App() {
  const [currentView, setCurrentView] = useState('Inicio'); // ['Inicio', 'Servicios', 'Acerca de']
  const [isShown, setIsShown] = useState(true);

  const handleMenuClick = (view) => { 
    console.log(`Changing view to: ${view}`);
    setCurrentView(view);
  }

  const handleButtonClick = () => {
    setIsShown(!isShown);
  }

  const menuView = isShown ? 'VertMenu' : 'VertMenu hide';
  const panelView = isShown ? 'Panel' : 'Panel expand';

  return (
    <article className='App'>
        <VertMenu onClick={handleMenuClick} menuView={menuView}/>
        <MenuButton onClick={handleButtonClick}/>
        <Panel currentView={currentView} panelView={panelView}/>
    </article>
  )
}