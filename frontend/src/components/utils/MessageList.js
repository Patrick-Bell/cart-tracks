import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Box, Typography, Card, TextField, Button, Tabs, Tab, IconButton, Chip, TableContainer, Table, TableHead, TableRow, TableCell, Badge } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'; // Send icon for the button
import { fetchAllManagers } from '../endpoints/ManagersRoutes';

const MessageList = ({ messages, onSend }) => {
  const { user } = useAuth();

  // State for the current tab
  const [value, setValue] = useState(0); // 0 for Messages tab, 1 for Info tab
  const [input, setInput] = useState('');
  const [managers, setManagers] = useState([])

  const fetchManagers = async () => {
    try{
      const managers = await fetchAllManagers()
      setManagers(managers)
      console.log('this is the managers', managers)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [value])

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
      window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom
    }
  };

  const determineOnlineStatus = (online) => {

    if (online) {
    return <Box sx={{display:'flex', alignItems:'center'}}>
    <Box style={{height:'10px', width:'10px', borderRadius:'50%', background:'green'}}></Box>
    <Typography sx={{marginLeft:'5px'}} variant='subtitle2'>Online</Typography>
    </Box>
  } else {
    return <Box sx={{display:'flex', alignItems:'center'}}>
    <Box style={{height:'10px', width:'10px', borderRadius:'50%', background:'grey'}}></Box>
    <Typography sx={{marginLeft:'5px'}} variant='subtitle2'>Offline</Typography>
    </Box>
  }

}

  return (
    <Box sx={{padding: '10px', overflowX:'scroll'}}>
      {/* Tabs */}
      <Tabs 
        value={value} 
        onChange={handleTabChange} 
        indicatorColor="primary" 
        textColor="primary" 
        centered
      >
        <Tab label="Messages" />
        <Tab label="Info" />
      </Tabs>

      {/* Tab Content */}
      {value === 0 && (  // Messages Tab
        <Box sx={{ overflowY: 'scroll', padding: '20px', paddingBottom: '80px' }}>
          {/* Date Header */}
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ padding: '10px', marginBottom: '15px'}}>
            <Chip variant="h6"
            sx={{position:'fixed'}}
            label={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            >
            </Chip>
          </Box>

          {/* Messages */}
          {messages.map((message, index) => {
            const isUser = user?.user.id === message.manager_id;
            const messageTime = new Date(message?.created_at).toLocaleTimeString().slice(0, 5)

            return (
              <Box key={index} display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'} marginBottom="10px">
                <Card sx={{
                  background: isUser ? '#b3e0ff' : '#d3d3d3',
                  borderRadius: '15px',
                  maxWidth:'60%',
                  boxShadow: 2,
                  overflowWrap: 'break-word', // Additional fallback for word breaking
                }}>
                  <Box sx={{ padding: '15px' }}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      {message?.manager?.name}
                    </Typography>
                    <Typography variant="body2">{message.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {messageTime}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      {value === 1 && (  // Info Tab
      <>
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>Information</Typography>
          <Typography variant="body2">
            All managers have access to this chat room. There is currently {managers.length} memebers in this chat.
          </Typography>
        </Box>
         <Box sx={{ padding: '20px' }}>
         <Typography variant="h5" gutterBottom>Members</Typography>
         <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{fontWeight:800}}>Manager</TableCell>
                <TableCell sx={{fontWeight:800}}>Online Status</TableCell>
                <TableCell sx={{fontWeight:800}}>Total Messages</TableCell>
              </TableRow>
            </TableHead>
            {managers.map((manager) => (
              <>
              <TableRow>
                <TableCell>{manager.name}</TableCell>
                <TableCell>{determineOnlineStatus(manager.online)}</TableCell>
                <TableCell>{manager.id}</TableCell>
              </TableRow>
              </>
            ))}
          </Table>
         </TableContainer>
         <Typography sx={{mt:1}} variant='subtitle2'>All messages delete at the end of every month.</Typography>
       </Box>
       </>
      )}

      {/* Input Form at the Bottom */}
      {value === 0 && (
        <Box component="form" onSubmit={handleSubmit} sx={{ position: 'fixed', bottom: 0, left: "240px", right: 0, padding: '10px', display: 'flex', alignItems: 'center', background: 'white', boxShadow: 2 }}>
          <TextField
            label="Enter a message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginRight: '10px' }}
          />
          <IconButton 
            type="submit" 
            color="primary"
            disabled={!input.trim()}
            sx={{ color: '#0077ff', borderRadius: '50%' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default MessageList;
