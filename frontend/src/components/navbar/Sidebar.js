import { Drawer, Box, List, ListItem, ListItemText, Divider, Avatar, IconButton, Typography as MuiTypography, Typography } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import MoreVert icon for 3-dots
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom'
import CountDown from "../utils/CountDown";
import { Toaster, toast } from "sonner";
import { useMediaQuery } from '@mui/material';


const drawerWidth = 240;

const Sidebar = ({ setActiveSection, activeSection }) => {  
  // State for opening and closing the sidebar
  const [open, setOpen] = useState(true); 
  const navigate = useNavigate()
  const isXs = useMediaQuery('(max-width:900px)');  // This doesn't require the theme


  const { user, logout, checkAuthStatus, expire } = useAuth();

  const userId = user?.user.id;  // Ensure user ID is being passed correctly
  console.log('this is the user ID about to log out', userId);
  console.log('this is the user', user);

  const handleSectionClick = (section) => {
    if (isXs) {
      setOpen(false);  // Close sidebar if on XS screen
    }
    setActiveSection(section);  // Update active section
  };

  // Toggle the sidebar state (open/close)
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    try {
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const response = await logout(userId); // Pass the userId directly
      console.log(response);
      navigate('/');
      toast.success("Logged out successfully");
    } catch (e) {
      console.log(e);
      toast.error("Logout failed");
    }
  };

  // Fallback image if picture_url is not available
  const fallbackAvatar = 'https://www.example.com/default-avatar.png'; // Replace with your default image URL

  return (
    <>
      {/* Sidebar Toggle Button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000, // Keep the button on top of the content
          background:'gold'
        }}
      >
        <ListIcon />
      </IconButton>

      {/* Drawer Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 0, // Set width based on open state
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 0,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease', // Smooth transition
          },
          '@media (max-width:900px)': {
            '& .MuiDrawer-paper': {
                width: open ? '100%' : 0,  // Full width on small screens
            }
        },
        }}
      >
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px' }}>
            <Box sx={{ height: '50px' }} component='img' src='https://www.bandstandmerch.com/wp-content/uploads/2022/01/BMSLogo.png' />
            {/* Use ListIcon to toggle the sidebar */}
            <IconButton sx={{background:"gold", color:'black', zIndex:100}} onClick={toggleSidebar}>
              <ListIcon />
            </IconButton>
          </Box>

          {/* List Items with Margin */}
          <List sx={{ m: 2 }}>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard' },
              { text: 'Events', section: 'games' },
              { text: 'Workers', section: 'workers' },
              { text: 'Managers', section: 'managers' },
              { text: 'Analytics', section: 'analytics' },
            ].map(({ text, section }) => (
              <ListItem
                button
                key={section}
                onClick={() => handleSectionClick(section)} // Update active section on click
                sx={{
                  borderRadius: 1,
                  cursor: 'pointer',
                  background: activeSection === section ? 'gold' : '',
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                }}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>

          <Divider />
          

          {/* Space between main content and bottom section */}
          <Box sx={{ marginTop: 'auto' }}>
            <Box sx={{m:2, background:'#EBB866', borderRadius:'4px', p:2}}>
              <Typography sx={{textAlign:'center'}}>Your session expires in </Typography>
            <Typography sx={{margin:'0px 0', textAlign:'center'}}><CountDown date={new Date(expire)}/></Typography>
            </Box>

            <Divider />
            <List sx={{ m: 2 }}>
        {[
          { text: 'Logout' }, // Add the Logout item
        ].map(({ text, section }) => (
          <ListItem 
            button 
            key={section}
            onClick={() => {
              if (text === 'Logout') {
                handleLogout(); // Call handleLogout if the text is 'Logout'
              } else {
                handleSectionClick(section); // Handle section click if not logout
              }
            }} 
            sx={{
              borderRadius: 1,
              cursor: 'pointer',
              background: activeSection === section ? 'gold' : '',
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
            }}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>

            {/* User Avatar and Name/Role */}
            <Divider />
            <List sx={{ m: 2, paddingBottom: '16px' }}>
              <ListItem sx={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
                <Avatar sx={{ width: 40, height: 40, marginRight: 2 }} src={user?.picture_url ? user.picture_url : fallbackAvatar}
                />
                <Box sx={{ flexGrow: 2 }}>
                  <MuiTypography variant="body1">{user.user.name || 'Loading...'}</MuiTypography>
                  <MuiTypography variant="body2" color="textSecondary">Admin</MuiTypography> {/* Using worker data here */}
                </Box>
                {/* 3 Dots (More Options) */}
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
