import '../hojas-de-estilo/TareaPage.css';
import patitoLogo from '../imagenes/patito.png';
import {ListaDeTareas} from '../components/tasks/ListaDeTareas';

function TareaPage() {
  return (
    <div className="App">
      <div className='freecodecamp-logo-contenedor'>
        <img
          src={patitoLogo}
          className='freecodecamp-logo'
          alt='' />
      </div>
      <div className='tareas-lista-principal'>
        <h1>Mis Tareas</h1>
        <ListaDeTareas />
      </div>
    </div>
  );
}

export default TareaPage;