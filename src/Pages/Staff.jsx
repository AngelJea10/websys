import React, { useState, useEffect } from "react";
import supabase from '../Services/Supabase';
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
import Copyright from '../Components/Copyright';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { Gif, GridOff } from "@mui/icons-material";

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
      main: '#800080',
    },
  },
  typography: {
    fontFamily: ['"Outfit"', 'sans-serif'].join(','),
  },
});

export default function StaffPage() {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState({
    f_name: '',
    l_name: '',
    address: '',
    tel_number: '',
    date_of_birth: '',
    nin: '',
    sex: '',
    salary_scale: '',
    salary: '',
    position: ''
  });
  const [error, setError] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    staffNum: '',
    wardId: '',
    shift: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*');

      if (error) {
        console.error('Error fetching staff:', error.message);
        return;
      }

      setStaffList(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching staff:', error.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setStaff(prevFormData => ({
      ...prevFormData,
      [event.target.name]: value
    }));
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  }

  async function addStaff(event) {
    event.preventDefault();
    setError(null);
  
    if (!staff.f_name || !staff.l_name || !staff.tel_number || !staff.position) {
      setError("Please fill in all required fields.");
      return;
    }
  
    const { data, error } = await supabase
      .from('staff')
      .insert(staff);
  
    if (error) {
      console.error("Error inserting data:", error);
      setError("Failed to save staff details. Please try again.");
    } else {
      console.log("Staff added:", data);
      fetchStaff();
      // Reset form fields after successful submission
      setStaff({
        f_name: '',
        l_name: '',
        address: '',
        tel_number: '',
        date_of_birth: '',
        nin: '',
        sex: '',
        salary_scale: '',
        salary: '',
        position: ''
      });
    }
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSeeStaffAllocationClick = () => {
    navigate('/dashboard/staff-alloc');
  };

  const handleCreateStaffAllocation = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_allocation')
        .insert([{ 
          staff_num: formData.staffNum,
          ward_id: formData.wardId,
          shift: formData.shift,
        }]);

      if (error) {
        console.error('Error inserting staff allocation:', error.message);
        window.alert(`Failed to create staff allocation: ${error.message}`);
        return;
      }

      console.log('Inserted staff allocation data:', data);
      window.alert('Staff allocation created successfully!');
    } catch (error) {
      console.error('Error creating staff allocation:', error.message);
      window.alert('Failed to create staff allocation');
    }
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
              Create Staff
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 5, display: 'flex', flexDirection: 'column', border: '2px solid #800080' }}>
                  <form onSubmit={addStaff}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="First Name"
                          name="f_name"
                          onChange={handleChange}
                          value={staff.f_name}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Last Name"
                          name="l_name"
                          onChange={handleChange}
                          value={staff.l_name}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Address"
                          name="address"
                          onChange={handleChange}
                          value={staff.address}
                          fullWidth
                          variant="outlined"  
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Telephone Number"
                          name="tel_number"
                          onChange={handleChange}
                          value={staff.tel_number}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Date of Birth"
                          name="date_of_birth"
                          onChange={handleChange}
                          value={staff.date_of_birth}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="NIN"
                          name="nin"
                          onChange={handleChange}
                          value={staff.nin}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Sex"
                          name="sex"
                          onChange={handleChange}
                          value={staff.sex}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Salary Scale"
                          name="salary_scale"
                          onChange={handleChange}
                          value={staff.salary_scale}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Salary"
                          name="salary"
                          onChange={handleChange}
                          value={staff.salary}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Position"
                          name="position"
                          onChange={handleChange}
                          value={staff.position}
                          fullWidth
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"></InputAdornment>,
                            style: { borderColor: 'black' }
                          }}
                          InputLabelProps={{
                            style: { color: 'black' }
                          }}
                        />
                      </Grid>
                    </Grid>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Button type='submit' variant="contained" color="primary">
                        Save
                      </Button>
                    </Box>
                  </form>
                </Paper>
              </Grid>
            </Grid>
             
            <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
              Staff List
            </Typography>
            <Grid container spacing={10}>
              <Grid item xs={12}>
                
                <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', border: '2px solid #800080', width: '110%' }}>
                  <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: 'nowrap' }}>ID</th>
                        <th style={{ whiteSpace: 'nowrap' }}>First Name</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Last Name</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Address</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Telephone Number</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Date of Birth</th>
                        <th style={{ whiteSpace: 'nowrap' }}>NIN</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Sex</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Salary Scale</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Salary</th>
                        <th style={{ whiteSpace: 'nowrap' }}>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList.map((staffMember) => (
                        <tr key={staffMember.staff_num}>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.staff_num}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.f_name}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.l_name}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.address}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.tel_number}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.date_of_birth}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.nin}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.sex}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.salary_scale}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.salary}</td>
                          <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{staffMember.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} >
            <Box sx={{ display: 'flex', marginTop: 2, gap: 2 }}>
              <TextField
                label="Staff Number"
                name="staffNum"
                value={formData.staffNum}
                onChange={handleFormChange}
                variant="outlined"
                sx={{ marginRight: 1, width: '18%' }}
              />
              <TextField
                label="Ward ID"
                name="wardId"
                value={formData.wardId}
                onChange={handleFormChange}
                variant="outlined"
                sx={{ marginRight: 1, width: '18%'  }}
              />
              <TextField
                label="Shift"
                name="shift"
                value={formData.shift}
                onChange={handleFormChange}
                variant="outlined"
                sx={{ marginRight: 1, width: '18%'  }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateStaffAllocation}
              >
                Create Staff Allocation
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSeeStaffAllocationClick}
                >
                  See Staff Allocation
                </Button>
            </Box>

            </Grid>
            
            
          </Container>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
