// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';

import { Button, Container, Card, CardContent, Typography, MenuItem, Select, FormControl, Box, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EducacionForm from './components/EducacionForm';
import ComunidadForm from './components/ComunidadForm';
import DocenteForm from './components/DocenteForm';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/public/estilo.css';
import './App.css';
import axios from 'axios';

function App() {
  // useState para manejar el formulario actual seleccionado
  const [formActual, setFormActual] = useState('Visitas Escuelas');
  // useState para almacenar datos de la comunidad y docentes
  const [comunidadData, setComunidadData] = useState(null);
  const [docenteData, setDocenteData] = useState(null);

  // Función para verificar si hay talleres disponibles en la comunidad y para docentes
  async function hayTalleres() {
    try {
      // Petición para obtener datos de la comunidad
      const comunidadResponse = await axios.get('http://localhost:3000/comunidad_data');
      setComunidadData(comunidadResponse.data);
    } catch (error) {
      console.error('Error al obtener datos de comunidad:', error);
      setComunidadData(null);
    }

    try {
      // Petición para obtener datos de docentes
      const docenteResponse = await axios.get('http://localhost:3000/docente_data');
      setDocenteData(docenteResponse.data);
    } catch (error) {
      console.error('Error al obtener datos de docente:', error);
      setDocenteData(null);
    }
  }

  // useEffect para llamar a la función hayTalleres una vez cuando el componente se carga
  useEffect(() => {
    hayTalleres();
  }, []);

  // Función para cambiar el formulario actual a "Visitas Escuelas"
  const handleEducacionClick = () => {
    setFormActual('Visitas Escuelas');
  };

  // Función para manejar el cambio en el selector de comunidad/docente, y actualizar formActual
  const handleComunidadChange = (e) => {
    const selectedValue = e.target.value;
    setFormActual(selectedValue);
  };

  // Función para redirigir al usuario al inicio del sistema o cambiar el formulario a "Visitas Escuelas"
  const handleReturnHome = () => {
    if (formActual === 'Taller Docente' || formActual === 'Taller Comunidad') {
      setFormActual('Visitas Escuelas');
    } else {
      window.location.href = '/EducarLab.html';  
    }
  };

  // Similar a handleReturnHome, pero para cuando el usuario hace clic en el logo
  const handleLogoClick= () => {
    if (formActual === 'Taller Docente' || formActual === 'Taller Comunidad') {
      setFormActual('Visitas Escuelas');
    } else {
      window.location.href = '/EducarLab.html';  
    }
  }

  return (
    <>
    <Container maxWidth="md" sx={{ py: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* Botón de inicio, que ejecuta handleReturnHome al hacer clic */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReturnHome}
          sx={{ minWidth: 'unset', width: '100px', height: '50px', p: 0, fontWeight:'1000', backgroundColor:'#E7214E', color:'white'}}
        >
          <HomeIcon style={{padding:'0px 0px 6px 0px'}}/>
          Inicio
        </Button>

        {/* Logo de la aplicación, con evento onClick para handleLogoClick */}
        <img
          src="/educarlablogo.png"
          alt="logo educar"
          style={{ width: 'auto', height: '10vh', cursor: 'pointer'}}
          onClick={handleLogoClick}
        />
      </Box>

      <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" component="div" gutterBottom sx={{ textAlign: "center", fontWeight: 'bold' }}>
            Formulario de Inscripción
          </Typography>
          
          {/* Contenedor de botones para seleccionar el formulario actual */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              {/* Botón para seleccionar "Visitas Escuelas" */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleEducacionClick}
                fullWidth
                style={{backgroundColor: '#8D5CF6', height:'55px'}}
              >
                Visitas Escuelas
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} >
              <FormControl fullWidth>
                {/* Select para elegir entre talleres de Comunidad y Docentes */}
                <Select
                  value={['Taller Docente', 'Taller Comunidad'].includes(formActual) ? formActual : ''}
                  displayEmpty
                  onChange={handleComunidadChange}
                  renderValue={(selected) => selected || "Talleres Abiertos "}
                  style={{backgroundColor: '#8D5CF6', color: 'white'}}
                >
                  <MenuItem value="" disabled>Talleres Abiertos </MenuItem>
                  <MenuItem value="Taller Docente">Talleres Docentes</MenuItem>
                  <MenuItem value="Taller Comunidad">Talleres Comunidad</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Renderizado condicional de componentes de formulario */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {formActual === 'Visitas Escuelas' && <EducacionForm />}
            {formActual === 'Taller Docente' && (
              docenteData ? <DocenteForm talleres={docenteData}/> : <Typography variant="h4" align="center">Próximamente</Typography>
            )}
            {formActual === 'Taller Comunidad' && (
              comunidadData ? <ComunidadForm talleres={comunidadData}/> : <Typography variant="h4" align="center">Próximamente</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  


  {/* Footer extraido de la pagina principal de educarLab a forma de diseño */}
  <footer className="footer" style={{marginTop: '20px'}}>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>¿Dónde visitarnos?</h5>
              <p>
                Si necesitas más información comunicate en{' '}
                <a href="mailto:educarlab@elechaco.edu.ar">educarlab@elechaco.edu.ar</a>{' '}
                o si querés ser parte del equipo.
              </p>
              <p><i className="num-contacto"></i> +54 3625175481</p>
              <div className="social-icons">
                <a href="https://www.facebook.com/profile.php?id=100083376645313&locale=es_LA"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/educarlabchaco/"><i className="fab fa-instagram"></i></a>
                <a href="https://x.com/conectar_LAB"><i className="fab fa-twitter"></i></a>
                <a href="https://www.youtube.com/channel/UCJHhJBtk8jtfIQ5B1H7iyVw"><i className="fab fa-youtube"></i></a>
              </div>
            </div>

            <div className="col-md-6 offset-md-2">
              <h5>Nosotros</h5>
              <ul className="list-unstyled">
                <li><a href="#pasos">Reservas</a></li>
                <li><a href="nosotros.html">EducarLab</a></li>
                <li><a href="#virtual">360</a></li>
                <li><a href="#Labs">Actividades</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ marginTop: '20px', textAlign: 'center' }}>
          <div className="container-logos">
            <div className="row">
              <div className="col-md-12">
                <div className="logo_container">
                  <img src="/src/assets/img/logos/Logo Chaco.png" alt="Logo Chaco" />
                  <img src="/src/assets/img/logos/Logo educar.png" alt="Logo Educar" />
                  <img src="/src/assets/img/logos/Logo Fontana.png" alt="Logo Fontana" />
                  <img src="/src/assets/img/logos/Logo Ministerio.png" alt="Logo Ministerio" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 finaltext">
            <div className="izquierda">
              <p>Copyright &copy; 2024 EducarLab | Design by IESETyFP</p>
            </div>
            <div className="derecha">
              <p><a href="#">Términos y Condiciones</a> | <a href="#">Política de Privacidad</a></p>
            </div>
          </div>
        </div>
      </footer>
  </>

);
}
export default App;
