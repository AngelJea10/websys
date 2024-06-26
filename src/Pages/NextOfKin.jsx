import React, { useState, useEffect } from 'react';
import supabase from '../Services/Supabase';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const NextOfKin = ({ patientNum }) => {
  const [kinDetails, setKinDetails] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    relationship_to_the_patient: '',
    address: '',
    tel_number: '',
    patient_num: patientNum
  });

  useEffect(() => {
    fetchKinDetails();
  }, [patientNum]);

  async function fetchKinDetails() {
    try {
      const { data, error } = await supabase
        .from('next_of_kin')
        .select('*')
        .eq('patient_num', patientNum);

      if (error) {
        console.error('Error fetching next of kin details:', error);
      } else {
        setKinDetails(data);
      }
    } catch (error) {
      console.error('Error fetching next of kin details:', error.message);
    }
  }

  const handleCreateOpen = () => {
    setFormData({
      full_name: '',
      relationship_to_the_patient: '',
      address: '',
      tel_number: '',
      patient_num: patientNum
    });
    setOpenCreateDialog(true);
  };

  const handleCreateClose = () => {
    setOpenCreateDialog(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async () => {
    try {
      const { error } = await supabase
        .from('next_of_kin')
        .insert([formData]);

      if (error) {
        console.error('Error creating next of kin:', error);
      } else {
        fetchKinDetails();
        handleCreateClose();
      }
    } catch (error) {
      console.error('Error creating next of kin:', error.message);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleCreateOpen}>
        Add Next of Kin
      </Button>
      <table className="table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Relationship to Patient</th>
            <th>Address</th>
            <th>Telephone Number</th>
            <th>Patient Number</th>
          </tr>
        </thead>
        <tbody>
          {kinDetails.map((kin) => (
            <tr key={kin.tel_number}>
              <td>{kin.full_name}</td>
              <td>{kin.relationship_to_the_patient}</td>
              <td>{kin.address}</td>
              <td>{kin.tel_number}</td>
              <td>{kin.patient_num}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={openCreateDialog} onClose={handleCreateClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Next of Kin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="full_name"
            label="Full Name"
            type="text"
            fullWidth
            value={formData.full_name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="relationship_to_the_patient"
            label="Relationship to Patient"
            type="text"
            fullWidth
            value={formData.relationship_to_the_patient}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={formData.address}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="tel_number"
            label="Telephone Number"
            type="text"
            fullWidth
            value={formData.tel_number}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NextOfKin;