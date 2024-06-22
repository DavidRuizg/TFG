import resumePDF from './assets/DavidCV.pdf';

export function DownloadButton() {

  const handleCVClick = () => {
    const link = document.createElement('a');
    link.href = resumePDF;
    link.download = "DavidCV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

    return (
      <div className='download-panel'>
        <span>Mi CV: </span>
        <img className="download-button" src='src\assets\download.png' onClick={handleCVClick}/>
      </div>
    )
}