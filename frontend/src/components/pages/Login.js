// LoginForm.js
import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Grid, InputAdornment} from '@mui/material';
import Logo from '../assets/Logo.png'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {}
  
    try {
      const response = await login(email, password); // Call login function
      console.log(response);
  
      if (response.message === "Login Successful") {
        navigate('/dashboard'); // Redirect on successful login
      } 
  
      // Handle specific error cases for email and password
      if (response.error) {
        // Initialize the error object
        const newErrors = {};
      
        // Check for email-related errors
        if (response.error.toLowerCase().includes('email')) {
          newErrors.email = 'Incorrect Email';
        }
      
        // Check for password-related errors
        if (response.error.toLowerCase().includes('password')) {
          newErrors.password = 'Incorrect Password';
        }
      
        // Set the errors to display immediately
        setErrors(newErrors);
      
        // Clear errors after 3 seconds
        setTimeout(() => {
          setErrors({});
        }, 3000);
      }

    } catch (e) {
      console.error(e);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          top:'50%', left:'50%', position:'absolute', transform:'translate(-50%,-50%)',
          border:'1px solid lightgrey',
          p:2,
          borderRadius:'10px'
        }}
      >
        <img style={{width:'250px'}} src={Logo}/>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
                fullWidth
                label="Password"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, background:'gold', color:'black' }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
