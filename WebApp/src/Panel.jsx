/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { HorizMenu } from './HorizMenu.jsx';
import { DownloadButton } from './DownloadButton.jsx';
import { Graph } from './Graph.jsx';
import useWebSocket from './useWebSocket';

import './HorizMenu.css'
import './DownloadButton.css';
import './Graph.jsx';

// Función para el renderizado de la sección principal de la aplicación
export function Panel({ currentView, panelView }) {
  // Llamada al Hook personalizado para la conexión con el servidor WebSocket, pasando como argumento la dirección del servidor
  const {socket, receivedData} = useWebSocket('ws://192.168.216.210:8080/');
  // Declaración del estado que almacenará los datos recibidos del servidor
  const [tableData, setTableData] = useState([]);
  // Declaración de los estados que almacenarán el estado de los relés para la modificación de la apariencia de los botones de la interfaz
  const [relay0State, setRelay0State] = useState("control-button off");
  const [relay1State, setRelay1State] = useState("control-button off");
  const [relay2State, setRelay2State] = useState("control-button off");
  const [relay3State, setRelay3State] = useState("control-button off");

  // Hook que se ejecuta cuando se recibe un mensaje del servidor
  useEffect(() => {
    // En caso de mensaje vacío o conversión incorrecta, no se hace nada
    if (receivedData === null) {
      return;
    }
    // En caso de recibir un mensaje, se comprueba el tipo de mensaje
    if (receivedData.Type === 'data') {   // En caso de recibir datos, se añaden a la tabla de datos
      setTableData((prevData) => [...prevData, receivedData]);
    }
    else if (receivedData.Type === 'state') {   // En caso de recibir un mensaje de estado, se actualiza el estado de los relés y la apariencia de los botones
      if (receivedData.State === 0) {
        (receivedData.Relay === 0) ? setRelay0State("control-button off") :
        (receivedData.Relay === 1) ? setRelay1State("control-button off") :
        (receivedData.Relay === 2) ? setRelay2State("control-button off") :
        (receivedData.Relay === 3) ? setRelay3State("control-button off") : console.log('Error: Relay not found.');
      }
      else if (receivedData.State === 1) {
        (receivedData.Relay === 0) ? setRelay0State("control-button on") :
        (receivedData.Relay === 1) ? setRelay1State("control-button on") :
        (receivedData.Relay === 2) ? setRelay2State("control-button on") :
        (receivedData.Relay === 3) ? setRelay3State("control-button on") : console.log('Error: Relay not found.');
      }
      else {
        console.log('Error: State not found.');
      }
    }

    return () => {    // No se realiza ninguna acción de limpieza
    };
  }, 
  [receivedData]);

  // Función para enviar mensajes de tipo orden al servidor, para controlar el estado de los relés
  const sendMessage = (relay, state) => {
      socket.send(`{"Type": "order", "Relay": ${relay}, "State": ${state}}`);
  }

  console.log(`Rendering content for: ${currentView}`);
  // Función para renderizar el contenido de la sección principal de la aplicación, alternando entre las diferentes vistas en función de la selección del usuario pasada como característica del componente
  const renderContent = () => {
    switch (currentView) {
      case 'Inicio':
        return  <section className={panelView}>
                  <header className='panel-title'>
                    Inicio
                  </header>
                  <div className="mainBlock">
                    Esta aplicación web se ha creado para el Trabajo de Fin de Grado. 
                    Su objetivo es, mediante React, mostrar los datos obtenidos del ESP32,
                    para mostrarlos, 
                    y permitir al usuario interactuar con las cargas de los dispositivos conectados.
                    <br/>
                    Para comenzar a utilizar la aplicación, seleccione una de las opciones del menú vertical que se 
                    encuentra a la izquierda de la pantalla.
                  </div>
                  <div className="mainBlock">
                    La página se divide en dos secciones principales, excluyendo la pantalla inicial en la que se encuentra ahora:
                    <ul>
                      <li>Servicios: En esta sección podrá visualizar los datos obtenidos por el sistema, y actuar sobre las cargas que lo conforman.</li>
                      <li>Información: En esta sección se describe brevemente la estructura del proyecto y se presenta el perfil del autor para quien le pueda ser de interés.  </li>
                    </ul>
                  </div>
                  
                  <img className='main-image' src='src\assets\mainImage.webp'/>

                  <img className='uah-image' src='src\assets\UahLogo.png'/>
                </section>;
      case 'Datos':
        return  <section className={panelView}>
                  <header className='panel-title'>
                    Datos de los dispositivos
                  </header>
                  <div className="mainBlock">
                    En esta sección se muestran los datos obtenidos por el ESP32.
                    <br/>
                    Las mediciones tomadas incluyen las siguientes variables:
                    <ul>
                      <li>Placa que ha realizado la medición. Para la maqueta se utilizará un ESP32, pudiendo ampliarse el número de placas involucradas.</li>
                      <li>Potencia eléctrica medida en Vatios.</li>
                      <li>Voltaje eléctrico en Voltios.</li>
                      <li>Intensidad eléctrica en Amperios.</li>
                      <li>Energía consumida en KWh.</li>
                      <li>Frecuencia de la red eléctrica en Hz.</li>
                      <li>Factor de potencia.</li>
                      <li>Fecha de la medición.</li>
                      <li>Hora de la medición.</li>
                  </ul>

                  <table className='data-table'>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Potencia (W)</th>
                        <th>Voltaje (V)</th>
                        <th>Intensidad (A)</th>
                        <th>Energia</th>
                        <th>Frecuencia</th>
                        <th>Factor de potencia</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row) => (
                        <tr key={row.ID}>
                          <td>{row.ID}</td>
                          <td>{row.Potencia}</td>
                          <td>{row.Voltaje}</td>
                          <td>{row.Intensidad}</td>
                          <td>{row.Energia}</td>
                          <td>{row.Frecuencia}</td>
                          <td>{row.FactorPotencia}</td>
                          <td>{row.Fecha}</td>
                          <td>{row.Hora}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </section>;
      case 'Graficas':
        return <section className={panelView}>
                  <header className='panel-title'>
                      Gráficas
                  </header>
                  <div className="mainBlock">
                    En esta sección se podrán generar gráficas para el análisis 
                    de las diferentes mediciones tomadas por el ESP32.
                    <div className='Line'>
                      <Graph tableData={tableData} type='Power'/>
                    </div>
                    <div className='Line'>
                      <Graph tableData={tableData} type='Voltage'/>
                    </div>
                    <div className='Line'>
                      <Graph tableData={tableData} type='Current'/>
                    </div>
                    <div className='Line'>
                      <Graph tableData={tableData} type='Energy'/>
                    </div>
                    <div className='Line'>
                      <Graph tableData={tableData} type='Frequency'/>
                    </div>
                    <div className='Line'>
                      <Graph tableData={tableData} type='PowerFactor'/>
                    </div>
                  </div>
                  
        </section>
      case 'Control':
        return  <section className={panelView}>
                  <header className='panel-title'>
                    Control sobre las cargas
                  </header>
                  <div className="mainBlock">
                    <span>
                      En esta sección se podrá controlar el estado de las cargas conectadas al ESP32.
                      <br/>
                      El usuario puede encender o apagar las cargas conectadas.
                    </span>
                    <div>
                      <div>
                        <img className='plug-image' src='src\assets\plug.png'/>
                        <button className={relay0State} onClick={() => sendMessage(0, (relay0State == "control-button off") ? 1 : 0)}>{(relay0State == "control-button off") ? "Encender" : "Apagar"}</button>
                      </div>
                      <div>
                        <img className='plug-image' src='src\assets\plug.png'/>
                        <button className={relay1State} onClick={() => sendMessage(1, (relay1State == "control-button off") ? 1 : 0)}>{(relay1State == "control-button off") ? "Encender" : "Apagar"}</button>
                      </div>
                      <div>
                        <img className='plug-image' src='src\assets\plug.png'/>
                        <button className={relay2State} onClick={() => sendMessage(2, (relay2State == "control-button off") ? 1 : 0)}>{(relay2State == "control-button off") ? "Encender" : "Apagar"}</button>
                      </div>
                      <div>
                        <img className='plug-image' src='src\assets\plug.png'/>
                        <button className={relay3State} onClick={() => sendMessage(3, (relay3State == "control-button off") ? 1 : 0)}>{(relay3State == "control-button off") ? "Encender" : "Apagar"}</button>
                      </div>
                    </div>
                  </div>
                </section>;
      case 'SobreP':
        return  <section className={panelView}>
                  <header className='panel-title'>
                    Sobre el proyecto
                  </header>
                  <div className="mainBlock">
                    <span>Este proyecto de fin de grado consta de tres elementos principales:
                      <ul className='sysElem-list'>
                        <li>Un ESP32 cuyas funciones son:
                          <ul>
                            <li>Obtener los datos de los sensores.</li>
                            <li>Controlar las cargas.</li>
                          </ul>
                        </li>                      
                        <li>Una base de datos creada con InfluxDB que almacena los datos obtenidos por el ESP32.<br/>
                          Los datos se reciben a través de una conexión PUB/SUB con MQTT Mosquitto
                          en la que el ESP32 publica los datos y la base de datos los recibe. 
                          Su función es almacenar el histórico de datos del sistema.</li>
                        <li>Esta aplicación web programada utilizando React+Vite.<br/>Sus funciones son:
                          <ul>
                            <li>Mostrar los datos obtenidos por el ESP32.</li>
                            <li>Permitir al usuario interactuar con las cargas.</li>
                          </ul>
                        </li>
                      </ul>
                    </span>

                    <img className='sysDiagram-image' src='src\assets\systemDiagram.png'/>
                  </div>
                </section>;
      case 'SobreM':
        return  <section className={panelView}>
                  <header className='panel-title'>
                    Sobre mi
                  </header>
                  <div className="mainBlock">
                    <span>Me llamo David Ruiz González, tengo 22 años.<br/>
                      Soy estudiante del Grado de Ingeniería Informática en la Universidad de Alcalá.
                      Actualmente estoy realizando el último curso de la carrera. <br/><br/>
                      Idiomas que hablo:
                      <ul>
                          <li><strong>Español:</strong> Lengua materna</li>
                          <li><strong>Inglés:</strong> C1 titulado por Cambridge</li>
                          <li><strong>Polaco:</strong> Aprendiendo actualmente</li>
                      </ul>
                      Lenguajes de programación junto con el nivel de dominio:
                      <ul>
                          <li><strong>Java:</strong> Alto</li>
                          <li><strong>C/C++:</strong> Alto</li>
                          <li><strong>Python:</strong> Alto</li>
                          <li><strong>JavaScript:</strong> Medio</li>
                          <li><strong>HTML/CSS:</strong> Medio</li>
                          <li><strong>SQL:</strong> Medio</li>
                          <li><strong>Scala:</strong> Medio</li>
                      </ul>
                    
                    <DownloadButton />
                    </span>
                  </div>
                  <HorizMenu />
                </section>;
      default:
        return  <section className={panelView}>
                  <header className='panel-title'>
                    Error 404
                  </header>
                  <div className="mainBlock">
                    <span>
                      La página solicitada no existe.
                    </span>
                  </div>
                </section>;
    }
  };

    // Renderizado de la sección principal de la aplicación
    return (
      <div>
        {renderContent()}
      </div>
    )
  }