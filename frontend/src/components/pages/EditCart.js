import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, Typography } from '@mui/material';
import { fetchAllWorkers } from '../endpoints/WorkersRoutes';
import { Toaster, toast } from 'sonner';
import { updateOneCart } from '../endpoints/CartRoutes';

const EditCart = ({ open, onClose, game, gameId }) => {
  const [workers, setWorkers] = useState([]);
  const [liveGame, setLiveGame] = useState({
    id: '',
    date: '',
    workers: [],
    cart_number: '',
    quantities_start: 0,
    quantities_added: 0,
    quantities_minus: 0,
    final_returns: 0,
    float: 0,
    worker_total: 0
  });
  
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    if (game) {
      setLiveGame({
        id: game?.id,
        date: game?.date,
        workers: game.workers.map(worker => worker.name),
        cart_number: game.cart_number,
        quantities_start: game.quantities_start,
        quantities_added: game.quantities_added,
        quantities_minus: game.quantities_minus,
        final_returns: game.final_returns,
        float: game.float,
        worker_total: game.worker_total + game.float
      });
    } else {
    }
  }, [game, open]); // Adjusted dependencies
  



  const handleChange = (e) => {
    setLiveGame({ ...liveGame, [e.target.name]: e.target.value });
  };

  const cartNumbers = ["1", "2", "3", "4", "5", "7", "10", "Bridge 2", "11", "14", "15", "16", "Gazebo 1", "Gazebo 2"];

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('cart[cart_number]', liveGame.cart_number);
    formData.append('cart[quantities_start]', liveGame.quantities_start);
    formData.append('cart[quantities_added]', liveGame.quantities_added);
    formData.append('cart[quantities_minus]', liveGame.quantities_minus);
    formData.append('cart[final_returns]', liveGame.final_returns);
    formData.append('cart[float]', liveGame.float);
    formData.append('cart[worker_total]', liveGame.worker_total);

    try {
      const response = await updateOneCart(game.id, formData);

      toast.message(`Cart: ${response.cart_number} has been updated!`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000,
      });

      onClose(); // Close the dialog after saving
    } catch (e) {
      console.error('Error updating cart:', e);
      toast.message('Failed to update cart.', { duration: 3000 });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Cart {liveGame.cart_number}</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`Game ID for ${gameId.name}`}
                name="cart_number"
                value={gameId.game_id}
                disabled
                variant="outlined"
              />
            </Grid>

            <Toaster />

            {/* Cart Number (non-editable, shown as text) */}
            <Grid item xs={6}>
              <Box sx={{border: '1px solid lightgrey', p:2, borderRadius:'4px'}}>
              <Typography variant="body1">Cart Number: <strong>{liveGame?.cart_number}</strong></Typography>
              </Box>
            </Grid>

            {/* Workers (non-editable, shown as text) */}
            <Grid item xs={6}>
            <Box sx={{border: '1px solid lightgrey', p:2, borderRadius:'4px'}}>
              <Typography variant="body1">Workers: <strong>{liveGame.workers && liveGame.workers.length > 0 ? liveGame.workers.join(', ') : 'No workers assigned'}</strong>
              </Typography>
              </Box>
            </Grid>

            {/* Quantities Start */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantities Start"
                name="quantities_start"
                value={liveGame.quantities_start}
                onChange={handleChange}
                variant="outlined"
                type="number"
                helperText={liveGame.quantities_start ? `equal to ${(liveGame.quantities_start / 45).toFixed(2)} boxes` : ''}
              />
            </Grid>

            {/* Quantities Added */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantities Added"
                name="quantities_added"
                value={liveGame.quantities_added}
                onChange={handleChange}
                variant="outlined"
                type="number"
                helperText={liveGame.quantities_added ? `equal to ${(liveGame.quantities_added / 45).toFixed(2)} boxes` : ''}
              />
            </Grid>

            {/* Quantities Minus */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantities Minus"
                name="quantities_minus"
                value={liveGame.quantities_minus}
                onChange={handleChange}
                variant="outlined"
                type="number"
                helperText={liveGame.quantities_minus ? `equal to ${(liveGame.quantities_minus / 45).toFixed(2)} boxes` : ''}
              />
            </Grid>

            {/* Final Quantity */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Returns"
                name="final_returns"
                value={liveGame.final_returns}
                onChange={handleChange}
                variant="outlined"
                type="number"
                helperText={liveGame.final_returns ? `equal to ${(liveGame.final_returns / 45).toFixed(2)} boxes` : ''}
              />
            </Grid>

            {/* Total Vouchers */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Float"
                name="float"
                value={liveGame.float}
                onChange={handleChange}
                variant="outlined"
                type="number"
              />
            </Grid>

            {/* Vouchers Value */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Workers Value"
                name="worker_total"
                value={liveGame.worker_total}
                onChange={handleChange}
                variant="outlined"
                type="number"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' sx={{ color: 'gold', border: '1px solid gold' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} sx={{ background: 'gold', color: 'black' }} color="primary">
          Confirm Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCart;
