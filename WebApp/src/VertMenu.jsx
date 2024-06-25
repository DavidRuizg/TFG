// Función que define el componente que representa el menú vertical de la aplicación
export function VertMenu({ onClick, menuView }) {
  // Renderización del menú vertical definido la estructura del componente
  // Estructura del menú vertical:
  // - Logo de la aplicación
  // - Opciones de menú: Inicio, Servicios, Información
  // - Subopciones de menú: Datos, Gráficas, Control cargas
  return (
    <article className={menuView}>
      <header  className="logo">
        <img className="logo-img" src="src\assets\logo.png" />
      </header>
        
      <div className="menu">
        <div className="menu-main">     
          <button onClick={() => onClick('Inicio')}>Inicio</button>
        </div>
        <div className="menu-main">
          <button>Servicios</button>
            <div className="menu-options">
              <button onClick={() => onClick('Datos')}>Datos</button>
              <button onClick={() => onClick('Graficas')}>Gráficas</button>
              <button onClick={() => onClick('Control')}>Control cargas</button>
            </div>
        </div>
        <div className="menu-main">          
          <button>Informacion</button>
          <div className="menu-options">
            <button onClick={() => onClick('SobreP')}>Sobre el proyecto</button>
            <button onClick={() => onClick('SobreM')}>Sobre mi</button>
          </div>
        </div>
      </div>
    </article>
  )
}