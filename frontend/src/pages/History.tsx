import { ArrowBackIosNew, BorderRight } from '@mui/icons-material'
import CarCrashIcon from '@mui/icons-material/CarCrash';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { Avatar, Button, Chip, Container, FormControlLabel, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Radio, styled, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../environment/environment';
import moment from 'moment';
import { TokenModel } from '../models/tokenModel';
import { jwtDecode } from 'jwt-decode';
import ProfileSection from '../components/ProfileSection';
import { cursorTo } from 'readline';
import { InsuranceList } from '../models/insuranceList';


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));



const History = () => {
  const [records, setRecords] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [insurances, setInsurances] = useState<InsuranceList[]>([]);
  const [decodedToken, setDecodedToken] = useState<TokenModel | null>(null);

  useEffect(() => {
    decodeToken();
    const list = localStorage.getItem("insuranceList");
    if(list){
      console.log(JSON.parse(list));
      setInsurances(JSON.parse(list));
    }
  }, []);

  const fetchRecords = async (decoded: TokenModel) => {
    if(decoded) {
      if(decoded.role == '1'){
        try {
          const response = await axios.get(`${API_URL}/quote`)
          console.log(response.data);
          setRecords(response.data);
        } catch (error) {
          console.log(error);
        }
  
      }else {
        try {
          const response = await axios.get(`${API_URL}/quote/user/${decoded.nameid}/quotes`)
          console.log(response.data);
          setRecords(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const decodeToken = () => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      setToken(token);
      try {
        const decoded = jwtDecode<TokenModel>(token);
        console.log(decoded);
        setDecodedToken(decoded);
        fetchRecords(decoded);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  };

  const selectInsuranceDesc = insurances.find(item => item.id === selectedRecord?.insuranceId)?.name || ''; 

  const profileName = (name: string | undefined) => {
    if (name) {
      const words = name.trim().split(/\s+/);

      if (words.length < 2) {
        return name.split('')[0];
      }

      const initials = words[0][0] + words[1][0];
      return initials.toUpperCase();
    }

    return '';
  }

  const crypthText = (text: string) => {
    if (text?.length > 20) {
      return text.slice(0, 15) + '...';
    }
    return text;
  } 

  return (
    <>
      <Container className="p-1" maxWidth="xl" sx={{ bgcolor: '#fff', mb: 2, borderRadius: 3 }}>
        <div className="flex items-center justify-between">
          <Typography component="h1" variant="h5" fontWeight={600}>
            Seguro Automotriz
          </Typography>
          <ProfileSection token={token} decodedToken={decodedToken} />
        </div>
      </Container>
      <Container className="p-1" maxWidth="xl" sx={{ bgcolor: '#fff', mb: 2, borderRadius: 3 }}>
        <div className="flex items-center gap-1">
          <Link to="/" className="btn-back">
            <ArrowBackIosNew />
          </Link>
          <Typography component="h1" variant="h5" m={2} fontWeight={600}>
            Historial de cotizaciones
          </Typography>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography component="h1" variant="h6" m={2} fontWeight={600}>
              Tipo de seguro
            </Typography>
            <div className="flex flex-col p-1 items-center gap-1 justify-center">
              <div className="radio-card w-3 h-3" style={{ background: '#f1f5f8', borderRadius: '1rem' }}>
                <DirectionsCarFilledIcon color='primary' sx={{ fontSize: '10rem' }} />
                <Typography component="p" fontWeight={600}>
                  {selectInsuranceDesc}
                </Typography>
              </div>
            </div>
            <Typography component="h1" variant="h6" m={2} fontWeight={600}>
              Información del Usuario
            </Typography>
            <Demo>
              <List>
                <ListItem className="card-details" secondaryAction={selectedRecord && (<Chip color={selectedRecord?.gender == 'female' ? 'warning' : 'primary'} label={selectedRecord?.gender == 'female' ? 'Mujer' : selectedRecord.gender == 'male' ? 'Hombre' : '*****'} />)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: selectedRecord?.gender == 'female' ? '#ef6c00' : '#1e88e5' }}>{profileName(selectedRecord?.fullName)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={!selectedRecord ? 'Nombre: ' : 'Nombre: ' + crypthText(selectedRecord?.fullName)} secondary={ !selectedRecord ? 'Correo: ' : 'Correo: ' + crypthText(selectedRecord?.email)} />
                </ListItem>
              </List>
            </Demo>
          </Grid>
          <Grid item xs={8}>
            <Typography component="p" variant='h6' padding={2} fontWeight={600}>
              Lista de cotizaciones
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>*</TableCell>
                  <TableCell>Vehículo</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.slice(0, 9).map((item: any) => (
                  <TableRow key={item.id} className="cursor" onClick={(() =>  setSelectedRecord(item))}>
                    <TableCell>
                      <Avatar sx={{ bgcolor: item.gender == 'female' ? '#ef6c00' : '#1e88e5' }}>{profileName(item.fullName)}</Avatar>
                    </TableCell>
                    <TableCell>{item.makes}</TableCell>
                    <TableCell>{moment(item.creationDate).format('L')}</TableCell>
                    <TableCell>${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default History
