import React, { useEffect, useState } from 'react';
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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';

import supabase from '../Services/Supabase'; // Adjust the path as per your file structure
import WaitingList from './WaitingList'; // Assuming this is correctly imported
import PatientRegistrationForm from '../Pages/PatientRegistrationForm'; // Correct path
import Copyright from '../Components/Copyright'; // Assuming this is correctly imported

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

const ListOfPa = () => {
  const [listOfPa, setListOfPa] = useState([]);
  const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [waitingListRefresh, setWaitingListRefresh] = useState(false);

  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    address: '',
    tel_number: '',
    date_of_birth: '',
    sex: '',
    marital_status: '',
    hospital_date_registered: '',
  });

  useEffect(() => {
    fetchListOfPa();
  }, []);

  async function fetchListOfPa() {
    try {
      const { data, error } = await supabase.from('patient_appointment').select('*');

      if (error) {
        console.error('Error fetching patient appointments:', error.message);
        return;
      }

      setListOfPa(data);
    } catch (error) {
      console.error('Error fetching patient appointments:', error.message);
    }
  }

  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setPrefillData({
      p_clinic_num: appointment.clinic_num,
      p_exam_room: appointment.exam_room,
      p_staff_num: appointment.staff_num,
      p_patient_type: appointment.recommended_to === 'out-patient' ? 'Out-patient' : 'In-patient',
    });
    setOpenRegistrationDialog(true);
  };

  const handleCreatePatient = async () => {
    try {
      const { data, error } = await supabase.from('patient').insert([formData]);

      if (error) {
        console.error('Error creating patient:', error.message || error);
        return;
      }

      console.log('Patient created successfully:', data);

      // Remove the corresponding appointment from the patient_appointment table
      const { error: deleteError } = await supabase
        .from('patient_appointment')
        .delete()
        .eq('appointment_num', selectedAppointment.appointment_num);

      if (deleteError) {
        console.error('Error deleting appointment:', deleteError.message || deleteError);
        return;
      }

      // Update the state to reflect the change
      const updatedListOfPa = listOfPa.filter(
        (appointment) => appointment.appointment_num !== selectedAppointment.appointment_num
      );
      setListOfPa(updatedListOfPa);

      setOpenRegistrationDialog(false); // Close the dialog after successful creation
      setAlertOpen(true); // Open success alert
    } catch (error) {
      console.error('Error creating patient:', error.message || error);
    }
  };

  const handleRegistrationClose = () => {
    setOpenRegistrationDialog(false);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
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
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
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
          <List component="nav">{mainListItems}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Appointment ID</th>
                        <th>Date and Time</th>
                        <th>Examination Room</th>
                        <th>Staff ID</th>
                        <th>Clinic ID</th>
                        <th>Recommended to</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listOfPa.map((appointment) => (
                        <tr
                          key={appointment.appointment_num}
                          onClick={() => handleRowClick(appointment)}
                          style={
                            selectedAppointment?.appointment_num === appointment.appointment_num
                              ? { backgroundColor: '#f0f0f0' }
                              : {}
                          }
                        >
                          <td>{appointment.appointment_num}</td>
                          <td>{appointment.date_time}</td>
                          <td>{appointment.exam_room}</td>
                          <td>{appointment.staff_num}</td>
                          <td>{appointment.clinic_num}</td>
                          <td>{appointment.recommended_to}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <WaitingList refresh={waitingListRefresh} />
                </Paper>
              </Grid>
            </Grid>
            <Dialog open={openRegistrationDialog} onClose={handleRegistrationClose}>
              <DialogTitle>Register Patient</DialogTitle>
              <DialogContent>
                <PatientRegistrationForm
                  formData={formData}
                  prefillData={prefillData}
                  onFormChange={handleFormChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleRegistrationClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCreatePatient} color="primary">
                  Register
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          Patient registered successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ListOfPa;
