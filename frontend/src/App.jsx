// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';

import { Button, Container, Card, CardContent, Typography, MenuItem, Select, FormControl, Box, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EducacionForm from './components/EducacionForm';
import ComunidadForm from './components/ComunidadForm';
import DocenteForm from './components/DocenteForm';
import './App.css'
import axios from 'axios';


function App() {
  // useStates para manejar el formulario actual y la existencia de cursos
  const [formActual, setFormActual] = useState('Visitas Escuelas');
  const [comunidadData, setComunidadData] = useState(null);
  const [docenteData, setDocenteData] = useState(null);


  async function hayTalleres() {
    try {
      const comunidadResponse = await axios.get('http://localhost:3000/comunidad_data');
      setComunidadData(comunidadResponse.data);
    } catch (error) {
      console.error('Error fetching comunidad data:', error);
      setComunidadData(null);
    }

    try {
      const docenteResponse = await axios.get('http://localhost:3000/docente_data');
      setDocenteData(docenteResponse.data);
    } catch (error) {
      console.error('Error fetching docente data:', error);
      setDocenteData(null);
    }
  }

  // useEffect para verificar la existencia de cursos al cargar el componente
  useEffect(() => {
    hayTalleres();
  }, []);

  // Controlador de eventos para cambio en el formulario, pone el formActual al valor "educacion"
  const handleEducacionClick = () => {
    setFormActual('Visitas Escuelas');
  };

  // Controlador de eventos para cambio en el formulario, agarra el valor del select, y lo pone en el formActual
  const handleComunidadChange = (e) => {
    const selectedValue = e.target.value;
    setFormActual(selectedValue);
  };

  // Controlador de eventos para cambio en el formulario, manda al usuario al inicio del sistema
  const handleReturnHome = () => {
    if (formActual === 'taller Docente' || formActual === 'taller Comunidad') {
      setFormActual('Visitas Escuelas');
    } else {
      window.location.href = '/ConectarLab.html';  
    }
  };

  const handleLogoClick= () =>{
    if (formActual === 'taller Docente' || formActual === 'taller Comunidad') {
      setFormActual('Visitas Escuelas');
    } else {
      window.location.href = '/ConectarLab.html';  
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleReturnHome}
        sx={{ minWidth: 'unset', width: '100px', height: '50px', p: 0, fontWeight:'1000', backgroundColor:'#8D5CF6', color:'white'}}
      >
        <HomeIcon style={{padding:'0px 0px 6px 0px'}}/>
        Inicio
      </Button>
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
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Select
                value={['taller Docente', 'taller Comunidad'].includes(formActual) ? formActual : ''}
                displayEmpty
                onChange={handleComunidadChange}
                renderValue={(selected) => selected || "Talleres Abiertos "}
                style={{backgroundColor: '#8D5CF6', color: 'white'}}
              >
                <MenuItem value="" disabled>Talleres Abiertos </MenuItem>
                <MenuItem value="taller Docente">Talleres Docentes</MenuItem>
                <MenuItem value="taller Comunidad">Talleres Comunidad</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {formActual === 'Visitas Escuelas' && <EducacionForm />}
          {formActual === 'taller Docente' && (
            docenteData ? <DocenteForm talleres={docenteData}/> : <Typography variant="h4" align="center">Próximamente</Typography>
          )}
          {formActual === 'taller Comunidad' && (
            comunidadData ? <ComunidadForm talleres={comunidadData}/> : <Typography variant="h4" align="center">Próximamente</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  </Container>
);

//Pie de Pagina EducarLab, Comienza desde Donde Visitarnos?

}

export default App;
