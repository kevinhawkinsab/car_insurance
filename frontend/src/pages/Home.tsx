import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import insurance from '../assets/insurance.jpg';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { useEffect, useState } from 'react';
import { MyLocation, Person } from '@mui/icons-material';
import axios from 'axios';
import { CarMake } from '../models/carMake';
import { CarModel } from '../models/carModels';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RuleIcon from '@mui/icons-material/Rule';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import { deepOrange } from '@mui/material/colors';
import backImage from "../assets/download.svg";

const defaultTheme = createTheme();

export default function Home() {
  const steps: number = 3;
  const fullCoverageDesc: string = 'Cubre los daños causados a otras personas y también los de tu auto, a consecuencia de un evento o accidente, como: colisión, vuelco, robo, incendio, inundación y otros desastres naturales.';
  const thirdPartyCoverageDesc: string = 'Cubre únicamente las lesiones corporales y daños causados al auto o propiedades de otras personas en un accidente de tránsito.';
  const [activeStep, setStep] = useState(0);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [openQuoteModal, setOpenQuoteModal] = useState(false);

  const handleMake = (event: SelectChangeEvent) => {
    setBrand(event.target.value);
    console.log(event.target.value);

    fetchCarModels(Number(event.target.value), '2020');
  };

  const handleModel = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };

  useEffect(() => {
    makes.push({
      id: 1,
      name: 'Mazda'
    });
    // fetchCarMakes();
  }, []);

  const fetchCarMakes = async () => {
    // try {
    //   const response = await axios.get('https://car-api2.p.rapidapi.com/api/makes?direction=asc&sort=id', {
    //     headers: {
    //       'x-rapidapi-key': 'f267c10fc2mshdcfd5864c42e3e9p1b800ejsn50971d5cc15e'
    //     }
    //   });
    //   setMakes(response.data.data);
    //   console.log(response.data.data);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const fetchCarModels = async (car_make_id: number, car_year: string) => {
    console.log(car_make_id, car_year);
    // try {
    //   const response = await axios.get(`https://car-api2.p.rapidapi.com/api/models?sort=id&direction=asc&year=2020&verbose=yes&make_id=13`, {
    //     headers: {
    //       'x-rapidapi-key': 'f267c10fc2mshdcfd5864c42e3e9p1b800ejsn50971d5cc15e'
    //     }
    //   });
    //   setModels(response.data.data);
    //   console.log(response.data.data);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const saveQuote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('SAVE');
  }

  return (
    <div>
      <Container className="p-1" maxWidth="xl" sx={{ bgcolor: '#fff', mb: 2,  borderRadius: '1rem' }}>
        <div className="flex items-center justify-between">
          <Typography component="h1" variant="h5" fontWeight={600}>
            Seguro Automotriz
          </Typography>
          <Link to="/history" className="flex gap-1">
            <Avatar sx={{ bgcolor: '#1e88e5' }}>KH</Avatar>
            <div className="flex flex-col">
              <Typography component="p" color="black" fontWeight={600}>
                Kevin Hawkins
              </Typography>
              <Typography component="p"  lineHeight={0} style={{color: 'grey'}}>
                Cliente
              </Typography>
            </div>
          </Link>
        </div>
        <div className="flex justify-between my-1">
          <div className="flex items-center">
            <PlaylistAddCheckCircleIcon color='primary' sx={{ fontSize: '3rem' }} />
            <Typography component="p" color="text.secondary" fontWeight={600}>
              Paso {activeStep + 1}/{steps + 1}: {activeStep === 0 ? 'Datos generales': activeStep === 1 ? 'Datos del auto' : activeStep === 2 ? 'Acerca de ti' : 'Cobertura'}
            </Typography>
          </div>
          {activeStep != 0 && (
            <div className="flex items-center gap-1">
              <Typography component="p" fontWeight={600}>
                Reiniciar
              </Typography>
              <IconButton aria-label="reset" onClick={(()=> setStep(0))}>
                <RotateLeftIcon color='primary' sx={{ fontSize: '2.5rem' }} />
              </IconButton>
            </div>
          )}
        </div>
      </Container>
      <Container component="main" className="p-1" maxWidth="sm" sx={{ background: '#fff', borderRadius: '1rem'}}>
        {activeStep === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SecurityIcon color='primary' sx={{ fontSize: '7rem' }} />
            <Typography component="h1" variant="h6" fontWeight={600}>
              ¿Qué tipo de seguro buscas?
            </Typography>
            <Box component="form" className="flex flex-col justify-center items-center" noValidate sx={{ my: 3 }}>
              <FormControl>
                <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="full" name="radio-buttons-group">
                  <Paper elevation={12} className="radio-card w-2 h-2" sx={{ borderRadius: 3 }}>
                    <DirectionsCarFilledIcon color='primary' sx={{ fontSize: '6rem' }} />
                    <FormControlLabel value="full" control={<Radio />} label="" sx={{ position: 'absolute', right: '0', top: '0.5rem' }} />
                    <Typography component="p" fontWeight={600}>
                      Cobertura completa
                    </Typography>
                  </Paper>
                  <Paper elevation={12} className="radio-card w-2 h-2" sx={{ borderRadius: 3 }}>
                    <CarCrashIcon color='primary' sx={{ fontSize: '6rem' }} />
                    <FormControlLabel value="third" control={<Radio />} label="" sx={{ position: 'absolute', right: '0', top: '0.5rem' }} />
                    <Typography component="p" fontWeight={600}>
                      Daños a terceros
                    </Typography>
                  </Paper>
                </RadioGroup>
              </FormControl>
              <Typography className="text-center" component="p" color="text.secondary" fontWeight={500} margin={2}>
                {activeStep === 0 ? fullCoverageDesc : thirdPartyCoverageDesc}
              </Typography>
            </Box>
          </Box>
        ) : activeStep === 1 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DirectionsCarFilledIcon color='primary' sx={{ fontSize: '7rem' }} />
            <Typography component="h1" variant="h6" fontWeight={600}>
              Información del vehículo
            </Typography>
            <Box component="form" className="flex flex-col justify-center items-center" noValidate sx={{ my: 3 }}>
              <Grid container spacing={3} sx={{ width: '600px' }}>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth sx={{mt: 2}}>
                    <InputLabel id="demo-simple-select-label">Marca</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={brand} label="Brand" onChange={handleMake}>
                      {makes.map((item) => (
                        <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Año" name="year" autoComplete="año"  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="outlined" fullWidth sx={{mt: 2}}>
                    <InputLabel id="demo-simple-select-label">Modelo</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={model} label="Model" onChange={handleModel}>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Costo" name="costo" autoComplete="email"  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        ): activeStep === 2 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Person color='primary' sx={{ fontSize: '7rem' }} />
            <Typography component="h1" variant="h6" fontWeight={600}>
              Datos del conductor
            </Typography>
            <Box component="form" className="flex flex-col justify-center items-center" noValidate sx={{ my: 3 }}>
              <Grid container spacing={3} sx={{ width: '600px' }}>
                <Grid item xs={12}>
                  <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Nombre completo" name="name" autoComplete="año"  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker label="Fecha de nacimiento" />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <FormLabel id="demo-row-radio-buttons-group-label">Género</FormLabel>
                  <FormControl>
                    <RadioGroup row  defaultValue="female" aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                      <FormControlLabel value="female" control={<Radio />} label="Femenino" />
                      <FormControlLabel value="male" control={<Radio />} label="Masculino" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Correo electrónico" name="email" autoComplete="email"  />
                </Grid>
                <Grid item xs={12}>
                  <TextField variant="outlined" margin="normal" required fullWidth id="phone" label="Teléfono celular (optional)" name="phone" autoComplete="phone"  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        ): (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MyLocation color='primary' sx={{ fontSize: '7rem' }} />
            <Typography component="h1" variant="h6" fontWeight={600}>
              ¿Qué tipo de cobertura buscas?
            </Typography>
            <Box component="form" className="flex flex-col justify-center items-center" noValidate sx={{ my: 3 }}>
              <FormControl>
                <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="fullCoverage" name="radio-buttons-group">
                  <Paper elevation={12} className="radio-card w-1 h-1" sx={{ borderRadius: 3 }}>
                    <DragHandleIcon color='primary' sx={{ fontSize: '4rem' }} />
                    <FormControlLabel value="civilCoverage" control={<Radio />} label="" sx={{ position: 'absolute', right: '0', top: '0.5rem' }} />
                    <Typography component="p" fontWeight={600}>
                      Resp. civil
                    </Typography>
                  </Paper>
                  <Paper elevation={12} className="radio-card w-1 h-1" sx={{ borderRadius: 3 }}>
                    <RuleIcon color='primary' sx={{ fontSize: '4rem' }} />
                    <FormControlLabel value="limitedCoverage" control={<Radio />} label="" sx={{ position: 'absolute', right: '0', top: '0.5rem' }} />
                    <Typography component="p" fontWeight={600}>
                      Limitada
                    </Typography>
                  </Paper>
                  <Paper elevation={12} className="radio-card w-1 h-1" sx={{ borderRadius: 3 }}>
                    <ChecklistRtlIcon color='primary' sx={{ fontSize: '4rem' }} />
                    <FormControlLabel value="fullCoverage" control={<Radio />} label="" sx={{ position: 'absolute', right: '0', top: '0.5rem' }} />
                    <Typography component="p" fontWeight={600}>
                      Amplia
                    </Typography>
                  </Paper>
                </RadioGroup>
              </FormControl>
              <Typography className="text-center" component="p" color="text.secondary" fontWeight={500} margin={2}>
                {activeStep === 0 ? fullCoverageDesc : thirdPartyCoverageDesc}
              </Typography>
            </Box>
          </Box>
        )}
        {activeStep === steps ? (
          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 5, padding: '10px', fontWeight: 600 }} onClick={(()=> setOpenQuoteModal(true))}>
            Generar Cotización
          </Button>
        ): (
          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 5, padding: '10px', fontWeight: 600 }} onClick={(() => setStep(activeStep + 1))}>
            Siguiente
          </Button>
        )}
      </Container>


      <Dialog open={openQuoteModal} className="p-1" onClose={(()=> setOpenQuoteModal(false))} PaperProps={{component: 'form', onSubmit: saveQuote}}>
        <DialogTitle>Cotización #12345</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid sx={{paddingTop: '1rem'}} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Nombre: Kevin Hawkins
              </Typography>
            </Grid>
            <Grid sx={{paddingTop: '1rem'}} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Marca: Kia
              </Typography>
            </Grid>
            <Grid sx={{paddingTop: '1rem'}} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Modelo: Kia Picanto
              </Typography>
            </Grid>
            <Grid sx={{paddingTop: '1rem'}} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Año: 2020
              </Typography>
            </Grid>
            <Grid sx={{paddingTop: '1rem'}} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Precio: $1,200
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{padding: '0 1.5rem'}}>
          <Button color='primary' onClick={(()=> setOpenQuoteModal(false))} fullWidth variant="outlined" sx={{ mt: 3, mb: 2, borderRadius: 5 }}>
            Cancelar
          </Button>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 5 }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}