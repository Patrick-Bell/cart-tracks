import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, Typography, CircularProgress, InputAdornment } from '@mui/material';
import { fetchAllManagers } from '../endpoints/ManagersRoutes';
import { addNewManager } from '../endpoints/ManagersRoutes';
import { Toaster, toast } from 'sonner';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AddManager = ({ open, onClose }) => {
  const [managerData, setManagerData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    picture: '',
    phone_number: ''
  });
  const [managers, setManagers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [button, setButton] = useState('Add Manager');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // State to handle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const fetchManagers = async () => {
    const response = await fetchAllManagers();
    setManagers(response.map(manager => ({
      manager_id: manager.id,
      name: manager.name,
    })));
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setManagerData({ ...managerData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setManagerData({ ...managerData, picture: file });

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

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!managerData.name) newErrors.name = 'First Name is required';
    if (!managerData.last_name) newErrors.last_name = 'Last Name is required';
    if (!managerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(managerData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!managerData.phone_number) {
      newErrors.phone_number = 'Phone Number is required';
    } else if (!/^\d{11}$/.test(managerData.phone_number)) {
      newErrors.phone_number = 'Phone Number must be 10 digits';
    }
    if (!managerData.password) newErrors.password = 'Password is required';
    else if (managerData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (!selectedFile) newErrors.picture = 'Profile Picture is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setButton(<CircularProgress size={24} sx={{ color: 'black', position: 'absolute' }} />);
    setLoading(true);

    const formData = new FormData();
    formData.append('manager[name]', managerData.name);
    formData.append('manager[last_name]', managerData.last_name);
    formData.append('manager[email]', managerData.email);
    formData.append('manager[password]', managerData.password);
    formData.append('manager[phone_number]', managerData.phone_number);

    if (selectedFile) {
      formData.append('manager[picture]', selectedFile);
    }

    try {
      const response = await addNewManager(formData);
      console.log(response);
      toast.success(`New Manager Added: ${managerData.name}`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      });
      onClose();
      setButton('Add Manager');
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Manager</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Toaster />

            {/* Manager Name */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="name"
                value={managerData.name}
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
                value={managerData.last_name}
                onChange={handleChange}
                variant="outlined"
                type="text"
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={managerData.email}
                onChange={handleChange}
                variant="outlined"
                type="email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={managerData.phone_number}
                onChange={handleChange}
                variant="outlined"
                type="number"
                error={!!errors.phone_number}
                helperText={errors.phone_number}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={managerData.password}
                onChange={handleChange}
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button sx={{ background: 'gold', color: 'black' }} onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>

            {/* Picture Upload Field */}
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="upload-picture"
                type="file"
                name="picture"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="upload-picture" style={{ display: 'flex', alignItems: 'center' }}>
              <Button disabled={loading} variant="outlined" component="span" sx={{ marginRight: 2, border: errors.picture ? '1px solid red' : '' , color: errors.picture ? 'red' : ''}}>
              Upload Picture
                  <FileUploadIcon />
                </Button>
                {selectedFile ? <>
                  <CheckIcon sx={{ color: 'green', mr: 1 }} /> File Selected
                </>
                  : "No File Selected"}
              </label>
              {errors.picture && (
                <Typography sx={{fontSize:'12px', margin:'3px 14px 0'}} color="error" variant="body2">{errors.picture}</Typography>
              )}
            </Grid>

            {/* Preview of the uploaded image */}
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

export default AddManager;
