import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';

const PatientRegistrationForm = ({ formData, onFormChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="First Name"
          name="f_name"
          value={formData.f_name}
          onChange={onFormChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Last Name"
          name="l_name"
          value={formData.l_name}
          onChange={onFormChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={onFormChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Telephone Number"
          name="tel_number"
          value={formData.tel_number}
          onChange={onFormChange}
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
          onChange={onFormChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Sex"
          name="sex"
          value={formData.sex}
          onChange={onFormChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Marital Status"
          name="marital_status"
          value={formData.marital_status}
          onChange={onFormChange}
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
          onChange={onFormChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Patient Type"
          name="patient_type"
          value={formData.patient_type}
          onChange={onFormChange}
        >
          <MenuItem value="In-patient">In-patient</MenuItem>
          <MenuItem value="Out-patient">Out-patient</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );
};

export default PatientRegistrationForm;