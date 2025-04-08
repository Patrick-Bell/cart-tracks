import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Card, CardContent, Button, Tooltip, Divider } from "@mui/material";
import GameDetail from "./GameDetail";
import { fetchAllGames } from '../endpoints/GamesRoutes';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import fallbackPic from '../assets/fallback-pic.png'
import LastSeen  from '../utils/LastSeen'
import { Tooltip as Tip} from 'react-tippy'

const WorkerDetails = ({ worker, setSelectedWorker }) => {
  // State to keep track of the selected game object
  const [selectedGame, setSelectedGame] = useState(null);

  const sold = worker.carts.reduce((sum, cart) => sum + cart.sold, 0)

  // Format date function
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-GB") : "N/A";

  // Format total function
  const formatTotal = (totalValue, workerValue) => {
    const difference = (totalValue - workerValue).toFixed(2);
    const color = difference == 0 ? 'grey' : (difference < 0 ? 'green' : 'red')
    return <span style={{ color }}>{`£${Math.abs(difference).toFixed(2)}`}</span>;
  };

  const averageMargin = (worker) => {
    const totalWorker = worker?.carts.reduce((sum, cart) => sum + cart.worker_total, 0)
    const totalValue = worker?.carts.reduce((sum, cart) => sum + cart.total_value, 0)

    const totalMargin = (totalWorker - totalValue)
    let perGame = (totalMargin / worker?.carts.length)

    const color = perGame == 0 ? 'grey' : (perGame < 0 ? 'red' : 'green')

    return <span><span style={{color}}> {`£${Math.abs(perGame).toFixed(2)}`}</span><span style={{color:'grey'}}> p/game</span></span>

  }
 

  const handleClose = () => setSelectedWorker(null);

  const handleBackToDetails = () => setSelectedGame(null);

  return (
    <Box sx={{ p: 0}}>
             <>
          {/* Personal Information Section */}
          <Card elevation={0} sx={{ mb: 3, borderRadius:'10px'}}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={worker.picture_url || fallbackPic}
                  alt={worker.name}
                  sx={{ width: 80, height: 80, mr: 3 }}
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{worker.name} {worker.last_name}</Typography>
                  <Typography sx={{display:'flex'}} color="textSecondary">Joined: {(worker.joined !== null ? formatDate(worker.joined) : 'N/A')}</Typography>
                  <Typography variant='subtitle2' sx={{color:'grey'}}>{worker.joined !== null ? <LastSeen date={worker.joined} />: ''}</Typography>
                </Box>
              </Box>
              <Box sx={{margin:'5px 0'}}>
              <Typography variant='subtitle2'><strong>Email:</strong> {worker.email || "N/A"}</Typography>
              <Typography variant='subtitle2'><strong>Phone Number:</strong> {worker.phone_number || "N/A"}</Typography>
              <Typography variant='subtitle2'><strong>Address:</strong> {worker.address || "N/A"}</Typography>
              </Box>
              <Divider />
              <Box sx={{margin:'5px 0'}}>
              {worker.carts.length > 0 && (
                <>
              <Typography variant='subtitle2'><strong>Shifts:</strong> {worker?.carts.length}</Typography>
              <Typography variant='subtitle2'><strong>Average Margin:</strong> {averageMargin(worker)}</Typography>
              <Typography variant='subtitle2'><strong>Programmes Sold:</strong> <span style={{color:'grey'}}>{(sold).toLocaleString()} ({(sold / 45).toFixed(2)} boxes)</span></Typography>
              </>
              )}
              {worker.watching && (
              <Typography sx={{color:'grey'}} variant='subtitle2'><strong>This worker is currently being watched</strong></Typography>
              )}
              </Box>
              <Divider />
              <Box sx={{display:'flex', justifyContent:'space-between', margin:"5px 0"}}>
                <Typography variant='subtitle2'><strong>Actions</strong></Typography>
              <Button onClick={handleClose} variant="contained" sx={{ background: 'gold', color: 'black', mt:'5px' }}>Go Back</Button>
              </Box>
            </CardContent>
          </Card>

          {/* Table for Games Worked On */}
          {worker?.carts.length === 0 ? (
            <Paper elevation={0} sx={{p:2, borderRadius:'10px'}}>
            <Typography>{worker?.name} has no games yet.</Typography>
          </Paper>
          ) : (
            <TableContainer sx={{borderRadius:'10px'}} elevation={0} component={Paper}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, p:2 }}>Events Worked On</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Event Date</strong></TableCell>
                  <TableCell><strong>Cart Worked</strong></TableCell>
                  <TableCell><strong>Sold</strong></TableCell>
                  <TableCell><strong>Returns (£)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {worker.carts
                .sort((a, b ) => new Date(a.date) - new Date(b.date))
                .map((cart) => (
                  <TableRow
                    key={cart.id}
                  >
                    <TableCell sx={{display:'flex', alignItems:'center', border:'none'}}>{formatDate(cart.date)}
                      <Tooltip title={cart.game?.name.split('v ')[1]} arrow placement='right'>
                      <CalendarMonthIcon/>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{border:'none'}}>{cart.cart_number}</TableCell>
                    <TableCell sx={{border:'none'}}>{cart.sold} / {cart.final_quantity}</TableCell>
                    <Tip title={`${cart.game?.name.split('v ')[1]}<hr>Returned: £${(cart.worker_total).toLocaleString()}<br>Expected: £${(cart.total_value).toLocaleString()}`} arrow position='left'>
                    <TableCell sx={{border:'none', cursor:'pointer'}}>{formatTotal(cart.total_value, cart.worker_total)}</TableCell>
                    </Tip>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </>
    </Box>
  );
};

export default WorkerDetails;
