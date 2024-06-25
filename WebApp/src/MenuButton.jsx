import { useState } from 'react';

// Función que genera un botón que permite mostrar u ocultar el menú lateral
// Recibe como parámetro la función que se ejecutará al pulsar el botón
export function MenuButton({ onClick }) {
    // Estado que indica si el menú lateral está mostrándose u ocultándose
    const [isShown, setIsShown] = useState(true);
    // Estilo que se aplicará al botón en función del estado del menú
    const buttonView = isShown ? 'MenuButton' : 'MenuButton hide';
    // Ruta de la imagen del botón en función del estado del menú
    const imageSrc = isShown ? '/src/assets/hideMenu.png' : '/src/assets/displayMenu.png';

    console.log(`Ruta imagen boton: ${imageSrc}`)
    // Función que se ejecuta al pulsar el botón y cambio del estado del botón
    const handleButtonClick = () => {
        setIsShown(!isShown);
        onClick();
    };
    // Estructura del botón con la imagen y la función que se ejecuta al pulsar el botón
    return (
        <section className={buttonView}>
            <div>
                <img className='buttonMenu' 
                src={imageSrc}
                onClick={handleButtonClick}/>
            </div>
        </section>
    )
}