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
import { ArrowBackIosNew, AttachMoney, Logout, MyLocation, Paid, Person } from '@mui/icons-material';
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
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { TokenModel } from '../models/tokenModel';
import { API_URL } from '../environment/environment';
import { useForm } from 'react-hook-form';
import { InsuranceModel } from '../models/insuranceModel';
import dayjs, { Dayjs } from 'dayjs';
import Swal from 'sweetalert2';
import ProfileSection from '../components/ProfileSection';
import { InsuranceList } from '../models/insuranceList';
import { CoverageList } from '../models/coverageList';

export default function Home() {
  const navigate = useNavigate();
  const {register,handleSubmit } = useForm();
  const steps: number = 3;
  const [activeStep, setStep] = useState(0);
  const [brand, setBrand] = useState('1');
  const [model, setModel] = useState('1');
  const [insurance, setInsurance] = useState<InsuranceModel>();
  const [insuranceId, setInsuranceId] = useState<number|null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [insuranceList, setInsuranceList] = useState<InsuranceList[]>([]);
  const [coveragesList, setCoveragesList] = useState<CoverageList[]>([]);
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [makesId, setMakesId] = useState<number>(1);
  const [models, setModels] = useState<CarModel[]>([]);
  const [openQuoteModal, setOpenQuoteModal] = useState(false);
  const [decodedToken, setDecodedToken] = useState<TokenModel | null>(null);
  const [birthdate, setBirthdate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [selectedInsurance, setSelectedInsurance] = useState(1);
  const [selectedCoverage, setSelectedCoverage] = useState(1);


  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);

    fetchCarMakes();
    fetchCoverages();
    fetchInsurances();

    if (token) {
      setToken(token);
      try {
        const decoded = jwtDecode<TokenModel>(token);
        console.log(decoded )
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }

    console.log(decodedToken);
  }, []);


  const fetchCarMakes = async () => {
    try {
      const response = await axios.get('https://car-api2.p.rapidapi.com/api/makes?direction=asc&sort=id', {
        headers: {
          'x-rapidapi-key': 'f267c10fc2mshdcfd5864c42e3e9p1b800ejsn50971d5cc15e'
        }
      });
      setMakes(response.data.data);
      console.log(response.data.data);
      fetchCarModels(1, '2020')
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCarModels = async (car_make_id: number, car_year: string) => {
    console.log(car_make_id, car_year);
    try {
      const response = await axios.get(`https://car-api2.p.rapidapi.com/api/models?sort=id&direction=asc&year=${car_year}&verbose=yes&make_id=${car_make_id}`, {
        headers: {
          'x-rapidapi-key': 'f267c10fc2mshdcfd5864c42e3e9p1b800ejsn50971d5cc15e'
        }
      });
      setModels(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoverages = async () => {
    try {
      const response = await axios.get(`${API_URL}/InsuranceInfo/Coverages`)
      console.log(response.data);
      setCoveragesList(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleRadioCoverageChange = (event: any) => {
    setSelectedCoverage(Number(event.target.value));
  };

  const selectCoverageDesc = coveragesList.find(item => item.id === selectedCoverage)?.description || '';



  const fetchInsurances = async () => {
    try {
      const response = await axios.get(`${API_URL}/InsuranceInfo/Insurances`)
      console.log(response.data);
      localStorage.setItem("insuranceList", JSON.stringify(response.data));
      setInsuranceList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRadioChange = (event: any) => {
    setSelectedInsurance(Number(event.target.value));
  };

  const selectedDescription = insuranceList.find(item => item.id === selectedInsurance)?.description || '';


  const handleMake = (event: SelectChangeEvent) => {
    setBrand(event.target.value);
    console.log(event.target.value);
    setMakesId(Number(event.target.value));

    fetchCarModels(Number(event.target.value), '2020');
  };

  const handleModel = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };

  const generateQuote = async (data: any) =>  {
    data.birthdate = birthdate?.format('YYYY-MM-DD');
    console.log(data);

    const makeName = makes.find(item => item.id == data.makes)?.name; 
    const modelName = models.find(item => item.id == data.model)?.name;

    console.log(makeName, ' | ' , modelName);


    data.makes = makeName;
    data.model = modelName;

    console.log('FINAL: ', data)

    const cost = data.cost;
    const year = Number(data.year);
    var insurance;
    try {
      const response = await axios.get(`${API_URL}/quote/quotePreview`, {
        params: {
          cost,
          year,
        },
      });

      insurance = response.data;
      console.log(insurance);
      data.price = insurance.price;

    } catch (err: any) {
      console.log(err.response.data);
    }
    setInsurance(data);
    setInsuranceId(insurance.quoteId);
    setOpenQuoteModal(true);
  };

  const inputNumber = (event: any) => {
    console.log(event.key);
    const pattern = /^[0-9]*$/;

    if (!pattern.test(event.key) && event.key != 'Backspace') {
      event.preventDefault();
    }
  }

  const inputAmount = (event: any) => {
    console.log(event.key);
    const inputValue = event.target.value;
    const pattern = /^[0-9]*\.?[0-9]{0,2}$/;

    if (!pattern.test(event.key) && event.key != 'Backspace') {
      event.preventDefault();
    }

    if (inputValue.includes('.')) {
      const decimalPart = inputValue.split('.');
      console.log(decimalPart[1])
      if (decimalPart[1].length >= 2 && event.key !== 'Backspace') {
        event.preventDefault();
      }
    }
  }

  const saveQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('SAVE', insurance);
    try {
      const response = await axios.post(`${API_URL}/quote`, insurance,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setOpenQuoteModal(false);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: response.data.message,
      }).then(() => {
        navigate('/history');
      });
    } catch (error: any) {
      console.error(error);

      setOpenQuoteModal(false);
      const nestedData = error.response.data;
      var message = '';

      if(nestedData.message) {
        message = nestedData.message
      }else {
        const value: any = Object.values(nestedData.errors)[0];
        message = value[0];
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  }

  return (
    <>
      <Container className="p-1" maxWidth="xl" sx={{ bgcolor: '#fff', mb: 2, borderRadius: '1rem' }}>
        <div className="flex items-center justify-between">
          <Typography component="h1" variant="h5" fontWeight={600}>
            Seguro Automotriz
          </Typography>
          <ProfileSection token={token} decodedToken={decodedToken} />
        </div>
        <div className="flex justify-between my-1">
          <div className="flex items-center">
            <PlaylistAddCheckCircleIcon color='primary' sx={{ fontSize: '3rem' }} />
            <Typography component="p" color="text.secondary" fontWeight={600}>
              Paso {activeStep + 1}/{steps + 1}: {activeStep === 0 ? 'Datos generales' : activeStep === 1 ? 'Datos del auto' : activeStep === 2 ? 'Acerca de ti' : 'Cobertura'}
            </Typography>
          </div>
          {activeStep !== 0 && (
            <div className="flex items-center gap-1">
              <Typography component="p" fontWeight={600}>
                Reiniciar
              </Typography>
              <IconButton aria-label="reset" onClick={() => setStep(0)}>
                <RotateLeftIcon color='primary' sx={{ fontSize: '2.5rem' }} />
              </IconButton>
            </div>
          )}
        </div>
      </Container>
      <Container component="main" className="p-1" maxWidth="sm" sx={{ background: '#fff', borderRadius: '1rem' }}>
        {activeStep != 0 && (
          <button type="reset" className="btn-back" onClick={() => setStep(activeStep - 1)}>
            <ArrowBackIosNew />
          </button>
        )}
        <Box component="form" noValidate>
          {activeStep === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <SecurityIcon color='primary' sx={{ fontSize: '7rem' }} />
              <Typography component="h1" variant="h6" fontWeight={600}>
                ¿Qué tipo de seguro buscas?
              </Typography>
              <Box className="flex flex-col justify-center items-center" sx={{ my: 3 }}>
                <FormControl>
                  <RadioGroup className="flex items-center justify-center" row aria-labelledby="demo-radio-buttons-group-label" value={selectedInsurance} onChange={handleRadioChange}>
                    {insuranceList.map(item => (
                      <Paper elevation={12} key={item.id} className="radio-card w-2 h-2" sx={{ borderRadius: 3 }}>
                        {item.id == 1 ? (
                          <DirectionsCarFilledIcon color='primary' sx={{ fontSize: '6rem' }} />
                        ) : (
                          <CarCrashIcon color='primary' sx={{ fontSize: '6rem' }} />
                        )}
                        <FormControlLabel value={item.id} control={<Radio {...register('insuranceId')} />} label="" sx={{ position: 'absolute', right: '0', top: '0.5rem' }} />
                        <Typography component="p" fontWeight={600}>
                          {item.name}
                        </Typography>
                      </Paper>
                    ))}
                    <Typography className="text-center" component="p" color="text.secondary" fontWeight={500} margin={2}>
                      {selectedDescription}
                    </Typography>
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          ) : activeStep === 1 ? (
            <div className="flex flex-col justify-center items-center">
              <DirectionsCarFilledIcon color='primary' sx={{ fontSize: '7rem' }} />
              <Typography component="h1" variant="h6" fontWeight={600}>
                Información del vehículo
              </Typography>
              <Box className="flex flex-col justify-center items-center" sx={{ my: 3 }}>
                <Grid container spacing={3} sx={{ width: '600px' }}>
                  <Grid item xs={6}>
                    <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="demo-simple-select-label">Marca</InputLabel>
                      <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Marca" value={brand} {...register('makes')} onChange={handleMake}>
                        {makes.map((item) => (
                          <MenuItem value={item.id + ''} key={item.id}>{item.name}</MenuItem>
                        ))}
                        {/* <MenuItem value={'10'}>Ten</MenuItem>
                        <MenuItem value={'20'}>Twenty</MenuItem>
                        <MenuItem value={'30'}>Thirty</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField variant="outlined"  margin="normal" required fullWidth id="year" onKeyDown={inputNumber} label="Año" {...register('year')}  />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="demo-simple-select-label">Modelo</InputLabel>
                      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={model} label="Modelo" {...register('model')}  onChange={handleModel}>
                        {models.map((item) => (
                          <MenuItem value={item.id + ''} key={item.id}>{item.name}</MenuItem>
                        ))}
                        {/* <MenuItem value={'10'}>Ten</MenuItem>
                        <MenuItem value={'20'}>Twenty</MenuItem>
                        <MenuItem value={'30'}>Thirty</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant="outlined" margin="normal" required fullWidth id="cost" onKeyDown={inputAmount} label="Costo" {...register('cost')}  />
                  </Grid>
                </Grid>
              </Box>
            </div>
          ) : activeStep === 2 ? (
            <div className="flex flex-col justify-center items-center">
              <Person color='primary' sx={{ fontSize: '7rem' }} />
              <Typography component="h1" variant="h6" fontWeight={600}>
                Datos del conductor
              </Typography>
              <Box className="flex flex-col justify-center items-center" sx={{ my: 3 }}>
                <Grid container spacing={3} sx={{ width: '600px' }}>
                  <Grid item xs={12}>
                    <TextField variant="outlined" margin="normal" required fullWidth id="fullName" label="Nombre completo" {...register('fullName')}  />
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker label="Fecha de nacimiento" value={birthdate} onChange={(newBirthdate) => setBirthdate(newBirthdate)} />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <FormLabel id="demo-row-radio-buttons-group-label">Género</FormLabel>
                    <FormControl>
                      <RadioGroup row defaultValue="female" aria-labelledby="demo-row-radio-buttons-group-label">
                        <FormControlLabel value="female" control={<Radio  {...register('gender')} />} label="Femenino" />
                        <FormControlLabel value="male" control={<Radio  {...register('gender')}/>} label="Masculino" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Correo electrónico" {...register('email')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant="outlined" margin="normal" required fullWidth id="phone" label="Teléfono celular (opcional)" {...register('phone')} />
                  </Grid>
                </Grid>
              </Box>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <MyLocation color='primary' sx={{ fontSize: '7rem' }} />
              <Typography component="h1" variant="h6" fontWeight={600}>
                ¿Qué tipo de cobertura buscas?
              </Typography>
              <Box className="flex flex-col justify-center items-center" sx={{ my: 3 }}>
                <FormControl>
                  <RadioGroup className="flex items-center justify-center" row aria-labelledby="demo-radio-buttons-group-label" value={selectedCoverage} onChange={handleRadioCoverageChange}>
                    {coveragesList.map(item => (
                      <Paper key={item.id} elevation={12} className="radio-card w-1 h-1" sx={{ borderRadius: 3 }}>
                        {item.id == 1 ? (
                          <DragHandleIcon color='primary' sx={{ fontSize: '4rem' }} />
                        ): item.id == 2 ? (
                          <RuleIcon color='primary' sx={{ fontSize: '4rem' }} />
                        ): (
                          <ChecklistRtlIcon color='primary' sx={{ fontSize: '4rem' }} />
                        )}
                        <FormControlLabel value={item.id}  control={<Radio {...register('coverageId')} />} label="" sx={{ position: 'absolute', right: '0', top: '0.5rem' }} />
                        <Typography component="p" fontWeight={600}>
                          {item.name}
                        </Typography>
                      </Paper>
                    ))}
                    <Typography className="text-center" component="p" color="text.secondary" fontWeight={500} margin={2}>
                    {selectCoverageDesc}
                  </Typography>
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          )}
          {activeStep === steps ? (
            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 5, padding: '10px', fontWeight: 600 }} onClick={handleSubmit(generateQuote)}>
              Generar Cotización
            </Button>
          ) : (
            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 5, padding: '10px', fontWeight: 600 }} onClick={() => setStep(activeStep + 1)}>
              Siguiente
            </Button>
          )}
        </Box>
      </Container>

      <Dialog open={openQuoteModal} className="p-1" onClose={() => setOpenQuoteModal(false)} PaperProps={{ component: 'form', onSubmit: saveQuote }}>
        <DialogTitle className="flex items-center">
          <Paid color='primary' sx={{ fontSize: '4rem' }} />
          <div className="flex flex-col justify-center py-1">
            <Typography id="modal-modal-title" variant="h6" fontWeight={600} component="h2">Información General</Typography>
            <Typography component="p" lineHeight={0}>Cotización: #{insuranceId}</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid container className="p-1">
            <Grid item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Nombre:</Typography>
              <Typography component="p">{insurance?.fullName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Marca:</Typography>
              <Typography component="p">{insurance?.makes}</Typography>
            </Grid>
            <Grid sx={{ paddingTop: '1rem' }} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Modelo:</Typography>
              <Typography component="p">{insurance?.model}</Typography>
            </Grid>
            <Grid sx={{ paddingTop: '1rem' }} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Año:</Typography>
              <Typography component="p">{insurance?.year}</Typography>
            </Grid>
            <Grid sx={{ paddingTop: '1rem' }} item xs={6}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Precio:</Typography>
              <Typography component="p">${insurance?.price}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '0 1.5rem' }}>
          <Button color='primary' onClick={() => setOpenQuoteModal(false)} fullWidth variant="outlined" sx={{ mt: 3, mb: 2, borderRadius: 5 }}>
            Cancelar
          </Button>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 5 }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}