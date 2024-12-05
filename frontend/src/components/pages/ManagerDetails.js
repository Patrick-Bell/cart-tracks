import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Card, CardContent, Divider, Button } from "@mui/material";
import { fetchOneManager } from "../endpoints/ManagersRoutes";
import { useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const ManagerDetails = ({ manager, setSelectedManager }) => {
  // Format date
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-GB") : "N/A";
  };


  console.log(manager)
  
  const handleClose = () => {
    setSelectedManager(null)
  }


  return (
    <Box sx={{ p: 3 }}>
      {/* Personal Information Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
                src={manager.picture_url || "https://via.placeholder.com/150"}
                alt={manager.name}
                sx={{ width: 100, height: 100, mr: 3, objectFit:'contain' }}
            />
            <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{manager.name} {manager.last_name}</Typography>
                <Typography color="textSecondary">Joined: {formatDate(manager.created_at)}</Typography>
            </Box>
            {/* This Box will take up the remaining space, pushing the button to the right */}
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={() => handleClose()} variant="contained" sx={{background:'gold', color:'black'}}>Go Back</Button>
            </Box>


          {/* Contact Info */}
          <Typography><strong>Email:</strong> {manager.email}</Typography>
          <Typography><strong>Phone Number:</strong> {manager.phone_number || "N/A"}</Typography>
          <Typography><strong>Address:</strong> {manager.address || "N/A"}</Typography>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, p:2 }}>Events Worked</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Event Date</strong></TableCell>
              <TableCell><strong>Event</strong></TableCell>
              <TableCell><strong>Completed</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manager.games.map(game => (
              <TableRow >
                <TableCell>{new Date(game.date).toLocaleDateString('en-GB')}</TableCell>
                <TableCell>{game.name}</TableCell>
                <TableCell>{game.complete_status ? <CheckIcon sx={{color:'green'}}/> : <CloseIcon sx={{color:'red'}}/>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


    </Box>
  );
};

export default ManagerDetails;
