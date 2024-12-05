import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, Typography, CircularProgress } from '@mui/material';
import { fetchAllWorkers } from '../endpoints/WorkersRoutes';
import { addNewWorker } from '../endpoints/WorkersRoutes';
import { Toaster, toast } from 'sonner';


const AddWorker = ({ open, onClose }) => {
  const [workers, setWorkers] = useState([])
  const [workerData, setWorkerData] = useState({
    name: '',
    last_name: '',
  });
  const [button, setButton] = useState('Add Worker');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});  // State for form errors

  const fetchWorkers = async () => {
    const response = await fetchAllWorkers();
    setWorkers(response.map(worker => ({
      worker_id: worker.id,
      name: worker.name,
    })));
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleChange = (e) => {
    setWorkerData({ ...workerData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!workerData.name) newErrors.name = "First name is required";
    if (!workerData.last_name) newErrors.last_name = "Last name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error("Please correct the errors in the form");
        return
    };  // Prevent submission if validation fails

    setButton(<CircularProgress size={24} sx={{ color: 'black', position: 'absolute' }} />);
    setLoading(true);

    const formData = new FormData();
    formData.append('worker[name]', workerData.name);
    formData.append('worker[last_name]', workerData.last_name);

    try {
      const response = await addNewWorker(formData);
      console.log(response);
      toast.message(`New Worker Added: ${workerData.name}`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      });
      onClose();
      setButton('Add Worker');
      setLoading(false);
      setWorkerData({ name: '', last_name: ''})
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Worker</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Toaster />
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="name"
                value={workerData.name}
                onChange={handleChange}
                variant="outlined"
                type="text"
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={workerData.last_name}
                onChange={handleChange}
                variant="outlined"
                type="text"
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>

          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: 'gold', border: '1px solid gold' }}>
          Cancel
        </Button>
        <Button
          sx={{
            background: 'gold',
            color: 'black',
            height: '35px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={handleSubmit}
          disabled={loading}
          color="primary"
        >
          {button}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorker;
