// src/Components/PatientRegistrationForm.jsx
import React from 'react';
import { TextField, Grid } from '@mui/material';

const PatientRegistrationForm = ({ formData, handleChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="First Name"
          name="f_name"
          value={formData.f_name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Last Name"
          name="l_name"
          value={formData.l_name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Telephone Number"
          name="tel_number"
          value={formData.tel_number}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.date_of_birth}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Sex"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Marital Status"
          name="marital_status"
          value={formData.marital_status}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Date Registered"
          name="hospital_date_registered"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.hospital_date_registered}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default PatientRegistrationForm;
