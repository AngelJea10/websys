import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../Components/NavList';
import supabase from '../Services/Supabase';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import InPatients from './InPatients';
import OutPatients from './OutPatients';
import NextOfKin from './NextOfKin';
import Copyright from '../Components/Copyright';

const drawerWidth = 290;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
);

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#800080', // Purple color
    },
  },
  typography: {
    fontFamily: ['"Outfit"', 'sans-serif'].join(','),
  },
});

export default function Patients() {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openNextOfKinDialog, setOpenNextOfKinDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const { data, error } = await supabase
        .from('patient')
        .select('*');

      if (error) {
        console.error('Error fetching patients:', error);
      } else {
        setPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  }

  const handleRowClick = (patient) => {
    setSelectedPatient(prevSelected =>
      prevSelected === patient ? null : patient
    );
  };

  const handleNextOfKinClick = () => {
    setOpenNextOfKinDialog(true);
  };

  const handleNextOfKinClose = () => {
    setOpenNextOfKinDialog(false);
    setSelectedPatient(null);
  };

  const handleUpdateOpen = () => {
    if (selectedPatient) {
      setOpenUpdateDialog(true);
    }
  };

  const handleUpdateClose = () => {
    setOpenUpdateDialog(false);
  };

  const handleDelete = async () => {
    try {
      if (selectedPatient) {
        const { error } = await supabase
          .from('patient')
          .delete()
          .eq('patient_num', selectedPatient.patient_num);
        
        if (error) {
          console.error('Error deleting patient:', error);
        } else {
          fetchPatients();
          setSelectedPatient(null);
        }
      }
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleUpdateSubmit = async () => {
    try {
      if (selectedPatient) {
        const { error } = await supabase
          .from('patient')
          .update({
            f_name: selectedPatient.f_name,
            l_name: selectedPatient.l_name,
            address: selectedPatient.address,
            tel_number: selectedPatient.tel_number,
            date_of_birth: selectedPatient.date_of_birth,
            sex: selectedPatient.sex,
            marital_status: selectedPatient.marital_status,
            hospital_date_registered: selectedPatient.hospital_date_registered,
            patient_type: selectedPatient.patient_type
          })
          .eq('patient_num', selectedPatient.patient_num);

        if (error) {
          console.error('Error updating patient:', error.message);
        } else {
          fetchPatients();
          setSelectedPatient(null);
          setOpenUpdateDialog(false);
        }
      }
    } catch (error) {
      console.error('Error updating patient:', error.message);
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setSelectedPatient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const renderTableRow = (patient) => (
    <tr
      key={patient.patient_num}
      onClick={() => handleRowClick(patient)}
      style={{
        backgroundColor: selectedPatient === patient ? '#E0E0E0' : 'transparent',
        cursor: 'pointer'
      }}
    >
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.patient_num}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.f_name}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.l_name}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.address}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.tel_number}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.date_of_birth}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.sex}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.marital_status}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.hospital_date_registered}</td>
      <td style={{ border: '2px solid #ccc', padding: '8px' }}>{patient.patient_type}</td>
    </tr>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{ pr: '24px' }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Wellmeadows Hospital
            </Typography>
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Patients
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={handleNextOfKinClick}
                    disabled={!selectedPatient}
                  >
                    View Next of Kin
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={handleUpdateOpen}
                    disabled={!selectedPatient}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDelete}
                    disabled={!selectedPatient}
                  >
                    Delete
                  </Button>
                </Box>
                <Paper sx={{ p: 5, display: 'flex', flexDirection: 'column', border: '3px solid #800080' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Patient Number</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>First Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Last Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Address</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Telephone Number</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date of Birth</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Sex</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Marital Status</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date Registered</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Patient Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map(renderTableRow)}
                    </tbody>
                  </table>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
            <Dialog open={openNextOfKinDialog} onClose={handleNextOfKinClose}>
              <DialogTitle>Next of Kin</DialogTitle>
              <DialogContent>
                <NextOfKin patientNum={selectedPatient?.patient_num} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleNextOfKinClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openUpdateDialog} onClose={handleUpdateClose}>
              <DialogTitle>Update Patient</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="First Name"
                  name="f_name"
                  value={selectedPatient?.f_name || ''}
                  onChange={handleUpdateFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  name="l_name"
                  value={selectedPatient?.l_name || ''}
                  onChange={handleUpdateFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Address"
                  name="address"
                  value={selectedPatient?.address || ''}
                  onChange={handleUpdateFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Phone"
                  name="tel_number"
                  value={selectedPatient?.tel_number || ''}
                  onChange={handleUpdateFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Date of Birth"
                  name="date_of_birth"
                  value={selectedPatient?.date_of_birth || ''}
                  onChange={handleUpdateFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Sex"
                  name="sex"
                  value={selectedPatient?.sex || ''}
                  onChange={handleUpdateFormChange}
                  select
                  fullWidth
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
                <TextField
                  margin="dense"
                  label="Marital Status"
                  name="marital_status"
                  value={selectedPatient?.marital_status || ''}
                  onChange={handleUpdateFormChange}
                  select
                  fullWidth
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </TextField>
                <TextField
                  margin="dense"
                  label="Date Registered"
                  name="hospital_date_registered"
                  value={selectedPatient?.hospital_date_registered || ''}
                  onChange={handleUpdateFormChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Patient Type"
                  name="patient_type"
                  value={selectedPatient?.patient_type || ''}
                  onChange={handleUpdateFormChange}
                  select
                  fullWidth
                >
                  <MenuItem value="InPatient">InPatient</MenuItem>
                  <MenuItem value="OutPatient">OutPatient</MenuItem>
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleUpdateClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleUpdateSubmit} color="primary">
                  Update
                </Button>
              </DialogActions>
            </Dialog>
      </Box>
      <Copyright />
    </ThemeProvider>
  );
}
