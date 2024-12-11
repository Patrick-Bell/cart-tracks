import { Box, CircularProgress, Typography } from '@mui/material';
import Sidebar from '../navbar/Sidebar';
import Games from './Games';
import Workers from './Workers';
import Managers from './Managers';
import MainPage from './MainPage';
import { useState } from 'react';
import Analytics from './Analytics';
import { Toaster, toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useRef } from 'react';

const Dashboard = () => {
  // State to track the selected section
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth()

  const hasShownToast = useRef(false);


  useEffect(() => {
    if (user?.user.name && !hasShownToast.current) {
      toast.success(`Welcome back, ${user?.user.name}`, {
        description: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 5000,
      });
      hasShownToast.current = true;  // Set to true after showing the toast
    }
  }, [user]);


  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <MainPage />
      case 'workers':
        return <Workers />;
      case 'games':
        return <Games />;
      case 'managers':
        return <Managers />;
      case 'analytics':
        return <Analytics />
      default:
        return <Box sx={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', position:'absolute', textAlign:'center'}}><CircularProgress thickness={10} sx={{color:'black'}} />
        <Typography sx={{mt:2}}>Coming Soon...</Typography>
        </Box>;
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {/* Permanent Drawer */}
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />  {/* Pass setActiveSection here */}
        <Toaster />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, bgcolor: 'background-default', minHeight: '100vh', maxWidth: '100%', margin:'auto auto' }}
        >
          {/* Render the selected section */}
          {renderSection()}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
