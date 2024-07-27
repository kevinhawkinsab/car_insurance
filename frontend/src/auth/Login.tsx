import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { FormControl, IconButton, Input, InputAdornment, InputLabel, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import insurance from '../assets/insurance.jpg';
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string>('Credenciales incorrectos!');
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      username: data.get('username'),
      password: data.get('password'),
    };

    console.log(user);

    // console.log('API:', API_URL);
    
    // try {
    //   const response = await axios.post(`${API_URL}/auth/login`, user);
    //   console.log(response.data);
    //   localStorage.setItem('token', response.data.jwtToken);
    //   navigate('/home');

    // } catch (error) {
    //   console.error(error);
    //   // setOpen(true);
    // }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '90vh'}}>
        <Grid container sx={{borderRadius: '1rem', padding: '2.5rem', background: '#f1f5f8'}}>
          <Grid item xs={12} sm={5} component={Paper} elevation={0} square>
            <Box sx={{my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <img src={insurance} className='bg-remove' height={200} alt="Lifetide" />
              <Typography component="h1" variant="h5" fontWeight={600}>
                ¡Bienvenido!
              </Typography>
              <Typography component="p" color="text.secondary" margin={2}>
                ¡Nos alegra volver a verte! Para utilizar tu cuenta, inicia sesión.
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField margin="normal" fullWidth variant='standard' id="username" label="Correo electrónico" name="username" autoComplete="email" autoFocus/>
                <FormControl margin="normal" fullWidth variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
                  <Input id="standard-adornment-password" name='password' type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, my: 5, padding: '10px', borderRadius: '0.6rem' }}>
                  Iniciar sesión
                </Button>

                <div className="text-center mt-1">
                  Aún no tienes cuenta? <Link to="/auth/register">Regístrate</Link>
                </div>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={false} sm={7}
            sx={{
              backgroundImage:'url("https://www.unitedinsurance.ws/web/images/Car_Insurance.jpg")',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',

            }}
          />
          </Grid>
      </Grid>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal:'right' }}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}