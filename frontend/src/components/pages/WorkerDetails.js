import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Card, CardContent, Button, Tooltip, Divider } from "@mui/material";
import GameDetail from "./GameDetail";
import { fetchAllGames } from '../endpoints/GamesRoutes';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const WorkerDetails = ({ worker, setSelectedWorker }) => {
  // State to keep track of the selected game object
  const [selectedGame, setSelectedGame] = useState(null);

  // Format date function
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-GB") : "N/A";

  // Format total function
  const formatTotal = (totalValue, workerValue) => {
    const difference = (totalValue - workerValue).toFixed(2);
    const color = difference < 0 ? "green" : "red";
    return <span style={{ color }}>{`£${Math.abs(difference).toFixed(2)}`}</span>;
  };
 

  const handleClose = () => setSelectedWorker(null);

  const handleBackToDetails = () => setSelectedGame(null);

  return (
    <Box sx={{ p: 3 }}>
             <>
          {/* Personal Information Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={worker.picture_url || "https://via.placeholder.com/150"}
                  alt={worker.name}
                  sx={{ width: 80, height: 80, mr: 3 }}
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{worker.name} {worker.last_name}</Typography>
                  <Typography color="textSecondary">Joined: {formatDate(worker.created_at)}</Typography>
                </Box>
              </Box>
              <Typography variant='subtitle2'><strong>Email:</strong> {worker.email || "N/A"}</Typography>
              <Typography variant='subtitle2'><strong>Phone Number:</strong> {worker.phone_number || "N/A"}</Typography>
              <Typography variant='subtitle2'><strong>Address:</strong> {worker.address || "N/A"}</Typography>
              <Divider />
              <Box sx={{display:'flex', justifyContent:'space-between', mt:1}}>
                <Typography variant='subtitle2'><strong>Actions</strong></Typography>
              <Button onClick={handleClose} variant="contained" sx={{ background: 'gold', color: 'black' }}>Go Back</Button>
              </Box>
            </CardContent>
          </Card>

          {/* Table for Games Worked On */}
          <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, p:2 }}>Events Worked On</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Event Date</strong></TableCell>
                  <TableCell><strong>Cart Number</strong></TableCell>
                  <TableCell><strong>Returns (£)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {worker.carts.map((cart) => (
                  <TableRow
                    key={cart.id}
                  >
                    <TableCell sx={{alignContent:'center', display:'flex'}}>{formatDate(cart.date)}
                      <Tooltip title={cart.game?.name} arrow placement='right'>
                      <CalendarMonthIcon />
                      </Tooltip>
                    </TableCell>
                    <TableCell>{cart.cart_number}</TableCell>
                    <TableCell>{formatTotal(cart.total_value, cart.worker_total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
    </Box>
  );
};

export default WorkerDetails;
