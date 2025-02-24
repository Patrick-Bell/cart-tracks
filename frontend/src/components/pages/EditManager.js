import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, Typography, CircularProgress, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { updateOneManager, updatePassword, updateAccess } from '../endpoints/ManagersRoutes';
import { Toaster, toast } from 'sonner';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useAuth } from "../../context/AuthContext";
import LastSeen from '../utils/LastSeen';
import CloseIcon from '@mui/icons-material/Close';
import {useMediaQuery} from '@mui/material';


const EditManager = ({ selectedManager, open, onClose }) => {
  const [managerData, setManagerData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [button, setButton] = useState('Update');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [selectedValue, setSelectedValue] = useState('')

  const isXs = useMediaQuery('(max-width:500px)');  // This doesn't require the theme


  const { user } = useAuth()

  useEffect(() => {
    if (selectedManager) {
      setManagerData({
        id: selectedManager.id,
        name: selectedManager.name,
        last_name: selectedManager.last_name,
        email: selectedManager.email,
        phone_number: selectedManager.phone_number,
        picture: selectedManager.picture_url,
        access: selectedManager.access,
        last_seen: selectedManager.last_seen,
        updated_at: selectedManager.updated_at,
        notifications: selectedManager.notifications
      });
    }
    setSelectedValue(selectedManager?.access || 'low'); // Sync selectedValue

  }, [selectedManager]);


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

  const validateForm = () => {
    const newErrors = {};
    if (!managerData.name) newErrors.name = 'First Name is required';
    if (!managerData.last_name) newErrors.last_name = 'Last Name is required';
    if (!managerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(managerData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const passwordErrors = {}
    if (!password) passwordErrors.password = 'Current password is required';
    if (!newPassword) passwordErrors.newPassword = 'New password is required';
    if (newPassword && newPassword.length < 8) passwordErrors.newPassword = 'Password must be at least 8 characters long';
    if (newPassword !== confirmPassword) passwordErrors.confirmPassword = 'Passwords do not match';
    if (!confirmPassword) passwordErrors.confirmPassword = 'Please confirm your new password';

    setTimeout(() => {
        setErrors({})
      }, 3000);
    
    setErrors(passwordErrors);
    return Object.keys(passwordErrors).length === 0;
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
    formData.append('manager[phone_number]', managerData.phone_number);

    if (selectedFile) {
      formData.append('manager[picture]', selectedFile);
    }

    try {
      const response = await updateOneManager(managerData?.id, formData);
      toast.success(`Manager updated: ${managerData.name}`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      });
      onClose();
      setButton('Update');
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const updateNewPassword = async () => {
    const passwordErrors = {};
    if (!validatePasswordForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
  
    const payload = { password, newPassword, confirmPassword };
  
    try {
      const response = await updatePassword(selectedManager.id, payload);
      toast.success('Password changed successfully');
      onClose()
      setPassword('')
      setConfirmPassword('')
      setNewPassword('')
    } catch (e) {
      console.log(e);
      const error = e.response?.data?.error;
      if (error && error.includes("current")) {
        passwordErrors.password = error;
        setErrors(passwordErrors);  // Properly update the errors state
      }
      toast.error(error || 'An error occurred while updating the password');
    }
  };
  

  const updateAccessForManager = async (id) => {
    const access = managerData?.access
    try{ 
      const response = await updateAccess(id, access)
      toast.success(`Access updated to ${managerData?.access} for ${selectedManager?.name}`, {
        description: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 5000
      })
      onClose()

    }catch(e){
      console.log(e)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <DialogTitle>Edit <strong>{isXs ? selectedManager?.name.slice(0, 7) + '...' : selectedManager?.name }</strong></DialogTitle>
        <Box sx={{ mr: 1 }}>
          <Button
            className="custom-swiper-button-prev"
            variant="contained"
            sx={{ color: 'black', background: 'gold', marginRight: 1 }}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            className="custom-swiper-button-next"
            variant="contained"
            sx={{ color: 'black', background: 'gold' }}
          >
            <ArrowRightIcon />
          </Button>
        </Box>
      </Box>
      <Swiper
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        modules={[Scrollbar, Navigation]}
        navigation={{
          prevEl: '.custom-swiper-button-prev',
          nextEl: '.custom-swiper-button-next',
        }}
        style={{ width: '100%', height: 'auto' }}
        virtual={false} // Disable virtual rendering

      >
        {/* First Slide */}
        <SwiperSlide>
            <DialogTitle variant='bold'>Personal Details</DialogTitle>
            <DialogContent sx={{minHeight:'290px', overflow:'scroll'}}>
            <Box sx={{ padding: 2 }}>
              <Grid container spacing={2}>
                {/* Form Fields */}
                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
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
                    <Button disabled variant="outlined" component="span" sx={{ marginRight: 2 }}>
                      Upload Picture
                      <FileUploadIcon />
                    </Button>
                    {selectedFile ? (
                      <>
                        <CheckIcon sx={{ color: 'green', mr: 1 }} /> File Selected
                      </>
                    ) : (
                      'No File Selected'
                    )}
                  </label>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions sx={{ mb: 1 }}>
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
        </SwiperSlide>


        {/* Second Slide */}
        { (user?.user?.name === selectedManager?.name || user?.user?.access === 'high') && (
        <SwiperSlide>
        <DialogTitle variant='bold'>Update Password</DialogTitle>
        <DialogContent sx={{minHeight:'290px', overflow:'scroll'}}>
        <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  type="password"
                />
              </Grid>
            </Grid>
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
              onClick={updateNewPassword}
              disabled={loading}
              color="primary"
            >
              {button}
            </Button>
          </DialogActions>
        </SwiperSlide>
         )}


         {/* Third Slide */}
         {user?.user?.access === 'high' && (
         <SwiperSlide>
  <DialogTitle variant='bold'>Access</DialogTitle>
  <DialogContent sx={{minHeight:'290px', overflow:'scroll'}}>
  <Accordion sx={{mb: 1}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Access Information
        </AccordionSummary>
        <AccordionDetails>
          <strong>Low</strong>: Users can <strong>read</strong> all data.<br></br>
          <strong>Middle</strong>: Users can <strong>create</strong>, <strong>read</strong> & <strong>update</strong> <em>Workers</em> & <em>Events</em> <br></br>
          <strong>High</strong>: Users can <strong>create</strong>, <strong>read</strong>, <strong>update</strong> & <strong>delete</strong> <em>Workers</em>, <em>Events</em> & <em>Managers</em>
        </AccordionDetails>
      </Accordion>
  <select
  labelId="access-label"
  value={managerData?.access} // Ensure a fallback value
  onChange={(e) => setManagerData({ ...managerData, access: e.target.value })}
  style={{padding:'16.5px 14px', width:'calc(100% - 30px',   
    appearance: 'none', // Hide default arrow
    WebkitAppearance: 'none', // For Safari
    MozAppearance: 'none', // For Firefox
  }}
>
  <option value="high">High</option>
  <option value="middle">Middle</option>
  <option value="low">Low</option>
</select>

<DialogTitle variant='bold' sx={{m:0, p:0, mt: 1, mb: 1}}>Info</DialogTitle>

<Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', p:1}}>
  {selectedManager?.online === true ? (
    <>
    <Typography>Status</Typography>
    <Typography>Online</Typography>
    </>
  ) : (
    <>
    <Typography>Last Seen</Typography>
    <Typography>{<LastSeen date={selectedManager?.last_seen} /> || "N/A"}</Typography>
    </>
  )}
</Box>
<Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', p:1}}>
<Typography>Notifications</Typography>
<Typography sx={{display:'flex', alignItems:'center'}}>{selectedManager?.notifications ? <CheckIcon sx={{color:'green'}} /> : <CloseIcon sx={{color:'red'}} />}</Typography>
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
      onClick={() => updateAccessForManager(selectedManager?.id)}
      disabled={loading}
      color="primary"
    >
      Update
    </Button>
  </DialogActions>
</SwiperSlide>
)}

      </Swiper>

    </Dialog>
  );
};

export default EditManager;
