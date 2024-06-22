
import { useState } from 'react';

export function MenuButton({ onClick }) {
    const [isShown, setIsShown] = useState(true);
    const buttonView = isShown ? 'MenuButton' : 'MenuButton hide';
    const imageSrc = isShown ? '/src/assets/hideMenu.png' : '/src/assets/displayMenu.png';

    console.log(`Ruta imagen boton: ${imageSrc}`)

    const handleButtonClick = () => {
        setIsShown(!isShown);
        onClick();
    };

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