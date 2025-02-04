import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, CircularProgress , Typography, Avatar} from '@mui/material';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { editOneWorker } from '../endpoints/WorkersRoutes';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckIcon from '@mui/icons-material/Check';

const EditWorker = ({ selectedWorker, openEdit, closeEdit }) => {
  const [workerData, setWorkerData] = useState({});
  const [button, setButton] = useState('Save');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // To hold validation errors
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setWorkerData({ ...workerData, picture: file });

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };


  useEffect(() => {
    if (selectedWorker) {
      setWorkerData({
        id: selectedWorker.id,
        name: selectedWorker.name,
        last_name: selectedWorker.last_name,
        address: selectedWorker.address || '',
        email: selectedWorker.email || '',
        phone_number: selectedWorker.phone_number || '',
        joined: selectedWorker.joined || ""
      });
      console.log(selectedWorker, 'selected worker')
    }
  }, [selectedWorker]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkerData((prev) => ({ ...prev, [name]: value }));
  };

  // Manual validation function
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Check if the name is empty
    if (!workerData.name.trim()) {
      newErrors.name = 'First Name is required';
      isValid = false;
    }

    // Check if the last name is empty
    if (!workerData.last_name.trim()) {
      newErrors.last_name = 'Last Name is required';
      isValid = false;
    }

    // Address is optional, so no validation for empty
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    const isValid = validateForm();
    if (!isValid) return; // Prevent save if validation fails

    setButton(<CircularProgress size={24} sx={{ color: 'black', position: 'absolute' }} />);
    setLoading(true);

    const formData = new FormData();
    formData.append('worker[name]', workerData.name);
    formData.append('worker[last_name]', workerData.last_name);
    formData.append('worker[email]', workerData.email);
    formData.append('worker[phone_number]', workerData.phone_number);
    formData.append('worker[address]', workerData.address);
    formData.append('worker[joined]', workerData.joined)

    if (selectedFile) {
      formData.append('worker[picture]', selectedFile)
    }


    try {
      const response = await editOneWorker(selectedWorker.id, formData);
      console.log(response);
      toast.message(`Worker: ${workerData.name} (ID: ${workerData.id}) has been updated!`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000,
      });
      closeEdit();
      setButton('Save');
      setLoading(false);
      setSelectedFile(null)
      setPreview('')
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={openEdit} onClose={closeEdit}>
      <DialogTitle>Edit Details for {workerData.name}</DialogTitle>
      <DialogContent fullWidth>
        <Avatar src={selectedWorker?.picture_url} fullWidth sx={{display:'flex', alignItems:'center', justifyContent:'center', margin:'auto auto', height:50, width:50}}/>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID"
                name="id"
                value={workerData.id}
                onChange={handleChange}
                variant="outlined"
                type="text"
                disabled
              />
            </Grid>

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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={workerData.address}
                onChange={handleChange}
                variant="outlined"
                type="text"
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={workerData.email}
                onChange={handleChange}
                variant="outlined"
                type="text"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={workerData.phone_number}
                onChange={handleChange}
                variant="outlined"
                type="text"
                error={!!errors.phone_number}
                helperText={errors.phone_number}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Joined"
                name="joined"
                value={workerData.joined}
                onChange={handleChange}
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                disabled
                accept="image/*"
                id="upload-picture"
                type="file"
                name="picture"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="upload-picture" style={{ display: 'flex', alignItems: 'center' }}>
                <Button disabled variant="outlined" component="span" sx={{ marginRight: 2, border: errors.picture ? '1px solid red' : '' , color: errors.picture ? 'red' : ''}}>
                  Upload Picture
                  <FileUploadIcon />
                </Button>
                {selectedFile ? (
                  <>
                    <CheckIcon sx={{ color: 'green', mr: 1 }} /> File Selected
                  </>
                ) : (
                  "No File Selected"
                )}
              </label>
              {errors.picture && (
                <Typography sx={{fontSize:'12px', margin:'3px 14px 0'}} color="error" variant="body2">{errors.picture}</Typography>
              )}
            </Grid>

            {preview && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Preview:</Typography>
                <Box sx={{ border: '1px solid #ddd', padding: 1, borderRadius: 1, textAlign: 'center' }}>
                  <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeEdit} variant="outlined" sx={{ color: 'gold', border: '1px solid gold' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{ background: 'gold', color: 'black', height:'35px' }}
          color="primary"
          disabled={loading}
        >
          {button}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorker;
