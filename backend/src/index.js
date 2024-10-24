// Importación de módulos necesarios
import express from 'express';
import cors from 'cors';
import { Escuela, Horarios, PostTurno, getHorariosOcupados, getFechasOcupadas, getCue } from './apis/formEscuelas.js';
import { PostTurnoComunidad, getComunidadData } from './apis/formComunidad.js';
import {  PostTurnoDocente, getDocenteData } from './apis/formDocente.js';

// Configuración de la aplicación Express
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true, }));
app.use(cors())

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: "ok" });
})

// Ruta para obtener datos de escuela
app.get('/get', (req, res) => {
    res.json(Escuela);
})  

// Ruta para obtener horarios
app.get('/get_horarios', (req, res) => {
  res.json(Horarios);
})

// Ruta para insertar turno de escuela
app.post('/post', (req, res) => {
    try {
        PostTurno(req);
        res.status(200).send('Datos insertados con éxito');
      } catch (error) {
        res.status(500).send('Error al insertar datos');
      }
})

// Ruta para insertar turno de comunidad
app.post('/post/comunidad', (req, res) => {
  try {
      PostTurnoComunidad(req);
      res.status(200).send('Datos insertados con éxito');
    } catch (error) {
      res.status(500).send('Error al insertar datos');
    }
})

// Ruta para insertar turno de docente
app.post('/post/docente', (req, res) => {
  try {
      PostTurnoDocente(req);
      res.status(200).send('Datos insertados con éxito');
    } catch (error) {
      res.status(500).send('Error al insertar datos');
    }
})


// Ruta para obtener horarios ocupados
app.get('/horarios/ocupados', async (req, res) => {
  const { fechaVisita } = req.query;

  try {
      const ocupados = await getHorariosOcupados(fechaVisita);
      res.json({ ocupados });
  } catch (error) {
      console.error('Error al traer los horarios ocupados:', error);
      res.status(500).json({ error: "Error al traer los horarios ocupados" });
  }
});

app.get('/fechas-sin-horarios' , async (req, res) =>{
  try{
    const fechasOcupadas= await getFechasOcupadas();
    const fechasSinHorarios = fechasOcupadas.map(fecha => 
      new Date(fecha).toISOString().split('T')[0]
    );
    res.json({fechasSinHorarios});
  } catch(error){
    console.error('Error al traer las fechas sin horarios: ', error);
    res.status(500).json({error: "Error al traer las fechas ocupadas"});
  }
})


// Ruta para obtener datos de comunidad
app.get('/comunidad_data', async (req, res) => {
  try {
      const data = await getComunidadData();
      res.json(data);
  } catch (error) {
      console.error('Error fetching comunidad data:', error);
      res.status(500).json({ error: "Error fetching comunidad data" });
  }
});

// Ruta para obtener datos de docente
app.get('/docente_data', async (req, res) => {
  try {
      const data = await getDocenteData();
      res.json(data);
  } catch (error) {
      console.error('Error fetching docente data:', error);
      res.status(500).json({ error: "Error fetching docente data" });
  }
});

app.get('/api/cue', async (req, res) => {
  try {
      const cueData = await getCue();
      res.json(cueData);
  } catch (error) {
      console.error('Error fetching CUE data:', error);
      res.status(500).json({ error: 'Error fetching CUE data' });
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000)