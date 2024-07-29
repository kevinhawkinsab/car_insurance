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


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));


const History = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/quote`)
      console.log(response.data);
      setRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <>
      <Container className="p-1" maxWidth="xl" sx={{ bgcolor: '#fff', mb: 2, borderRadius: 3 }}>
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
              <Typography component="p" lineHeight={0} style={{ color: 'grey' }}>
                Cliente
              </Typography>
            </div>
          </Link>
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
                  {selectedRecord?.fullName}
                </Typography>
              </div>
            </div>
            <Typography component="h1" variant="h6" m={2} fontWeight={600}>
              Información General
            </Typography>
            <Demo>
              <List>
                <ListItem className="card-details" secondaryAction={<Chip color="warning" label={'Rejected'} />}>
                  <ListItemAvatar>
                    <Avatar>
                      <DirectionsCarFilledIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Leslie Sansone" secondary="Appointment on Jun 22 - 10:30pm" />
                </ListItem>
                <ListItem className="card-details" secondaryAction={<Chip color="warning" label={'Rejected'} />}>
                  <ListItemAvatar>
                    <Avatar>
                      <DirectionsCarFilledIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Leslie Sansone" secondary="Appointment on Jun 22 - 10:30pm" />
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
                  <TableRow key={item.id} onClick={(() =>  setSelectedRecord(item))}>
                    <TableCell>
                      <Avatar sx={{ bgcolor: '#1e88e5' }}>{profileName(item.fullName)}</Avatar>
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
