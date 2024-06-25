import resumePDF from './assets/DavidCV.pdf';
// Función que define el componente de un botón de descarga
export function DownloadButton() {
  // Función que se ejecuta al hacer click en el botón de descarga, estableciendo la ruta del archivo a descargar y descargándolo
  const handleCVClick = () => {
    const link = document.createElement('a');
    link.href = resumePDF;
    link.download = "DavidCV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
    // Renderización del botón de descarga definiendo la estructura del componente
    return (
      <div className='download-panel'>
        <span>Mi CV: </span>
        <img className="download-button" src='src\assets\download.png' onClick={handleCVClick}/>
      </div>
    )
}