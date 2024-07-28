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
import { Container, CssBaseline, FormControl, IconButton, Input, InputAdornment, InputLabel, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import insurance from '../assets/insurance.jpg';
import { API_URL } from '../environment/environment';
import Swal from 'sweetalert2';
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      email: data.get('email'),
      password: data.get('password'),
    };

    console.log(user);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, user);
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/');

    } catch (error: any) {
      console.error(error);

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
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm" style={{height: '100vh', display: 'flex', alignItems: 'center'}}>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: '1rem', padding: '2rem'}}>
          <img src={insurance} className='bg-remove' height={200} alt="Lifetide" />
          <Typography component="h1" variant="h5" fontWeight={600}>
            ¡Bienvenido!
          </Typography>
          <Typography component="p" color="text.secondary" className="text-center" margin={2}>
            ¡Nos alegra volver a verte! Para utilizar tu cuenta, inicia sesión.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField margin="normal" fullWidth variant='standard' id="email" label="Correo electrónico" name="email" autoComplete="email" autoFocus />
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
      </Container>
    </ThemeProvider>
  );
}