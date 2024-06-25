// Función que define un panel horizontal con información de contacto
export function HorizMenu() {
  // Estrucutra del panel horizontal
  // Icono representando el medio de contacto
  // Información descriptiva del contacto
  return (
    <div className='HorizMenu'>
      <div className="info">
        <div className="infoBlock">
          <img className="icon-img"
            src="https://cdn-icons-png.flaticon.com/512/1216/1216841.png"
            />
          <span>+34 601 27 61 32</span>
        </div>
        <div className="infoBlock">
          <img className="icon-img"
            src="https://cdn-icons-png.flaticon.com/512/1313/1313686.png" />
          <span>david.ruizg@edu.uah.es</span>
        </div>
      </div>
      <div className="info">
        <div className="infoBlock">
          <img className="icon-img"
            src="https://cdn-icons-png.flaticon.com/512/739/739270.png" />
          <span >David Ruiz González</span>             
        </div>
        <div className="infoBlock">
          <img className="icon-img"
            src="https://cdn-icons-png.flaticon.com/512/87/87390.png" />
          <span>@david.rzglez</span>
        </div>
      </div>
    </div>
  )
}