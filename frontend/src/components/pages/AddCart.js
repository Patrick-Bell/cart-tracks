import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Autocomplete, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, Divider , CircularProgress} from '@mui/material';
import { fetchAllWorkers } from '../endpoints/WorkersRoutes';
import { addCartToGame } from '../endpoints/GamesRoutes';
import { toast } from 'sonner'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { gazebo_1, gazebo_2 } from '../utils/CartInformation';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';



const AddCart = ({ open, onClose, game }) => {
  const [cartData, setCartData] = useState({
    game_id: game?.id,
    date: game?.date,
    cart_number: '',
    worker_ids: [],
    quantities_start: '',
    quantities_added: '',
    quantities_minus: '',
    final_returns: '',
    float: '',
    worker_total: '', // For the worker
  });
  const [workers, setWorkers] = useState([]);
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [button, setButton] = useState('Add')


  const validateForm = () => {
    let newErrors = {};
    const today = new Date();
  
    if (!cartData.cart_number) newErrors.cart_number = "Cart Number is required";
    if (cartData.worker_ids.length === 0) newErrors.worker_ids = "At least 1 worker is required";
    if (!cartData.quantities_start) newErrors.quantities_start = 'Field is required';
    if (!cartData.quantities_added) newErrors.quantities_added = 'Field is required. If none, please put 0';
    if (!cartData.quantities_minus) newErrors.quantities_minus = 'Field is required. If none, please put 0';
    if (!cartData.final_returns) newErrors.final_returns = 'Field is required. If none, please put 0';
    if (!cartData.float) newErrors.float = 'Field is required';
    if (!cartData.worker_total) newErrors.worker_total = 'Field is required';
  
    setErrors(newErrors);
  
    // Clear errors after 3 seconds
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 3000);
    }
 
    return Object.keys(newErrors).length === 0;
  };
  

  const resetCart = () => {
    setCartData({
      game_id: game?.id,
      date: game?.date,
      cart_number: '',
      worker_ids: [],
      quantities_start: '',
      quantities_added: '',
      quantities_minus: '',
      final_returns: '',
      float: '',
      worker_total: '',
    })
  }

  // Fetch workers data
  const fetchWorkers = async () => {
    const response = await fetchAllWorkers();
    setWorkers(response.map(worker => ({
      worker_id: worker.id,
      name: worker.name,
      last_name: worker.last_name
    })));
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleChange = (e) => {
    setCartData({ ...cartData, [e.target.name]: e.target.value });
  };

  const handleWorkerChange = (event, values) => {
    // Update worker_ids with selected workers
    setCartData({ ...cartData, worker_ids: values.map(worker => worker.worker_id) });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return
  }; 

  setButton(<CircularProgress size={24} sx={{ color: 'black', position: 'absolute' }} />);
  setLoading(true);

    try{ 
      const response = await addCartToGame(cartData)
      toast.message(`Cart Number ${cartData.cart_number} added!`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      });
      resetCart()
      onClose()
      setLoading(false)
      setButton('Add')
    }catch(e){
      console.log(e)
    }
  };


  const formatBusy = (cart) => {

    if (cart.busy_level === "low") {
    return <Box sx={{display:'flex', alignItems:'center'}}>
    <Box style={{height:'10px', width:'10px', borderRadius:'50%', background:'red'}}></Box>
    <Typography sx={{marginLeft:'5px'}} variant='subtitle2'>Low</Typography>
    </Box>
  } else if (cart.busy_level === "middle") {
    return <Box sx={{display:'flex', alignItems:'center'}}>
    <Box style={{height:'10px', width:'10px', borderRadius:'50%', background:'orange'}}></Box>
    <Typography sx={{marginLeft:'5px'}} variant='subtitle2'>Middle</Typography>
    </Box>
  } else if (cart.busy_level === 'high') {
    return <Box sx={{display:'flex', alignItems:'center'}}>
    <Box style={{height:'10px', width:'10px', borderRadius:'50%', background:'green'}}></Box>
    <Typography sx={{marginLeft:'5px'}} variant='subtitle2'>High</Typography>
    </Box>
  }

}

const cartNumbers = ["1", "2", "3", "4", "5", "7", "10", "Bridge 2", "11", "14", "15", "16", "17", "Gazebo 1", "Gazebo 2"];

  return (
    
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Cart</DialogTitle>
      
      <DialogContent>
      <Swiper slidesPerView={1} 
        modules={[Scrollbar, Navigation]}
        scrollbar={{ draggable: true }}
        navigation={{
          prevEl: '.custom-swiper-button-prev',
          nextEl: '.custom-swiper-button-next',
        }}
        >
        <SwiperSlide>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Game ID (readonly) */}


            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`Game ID for ${game.name}`}
                name="cart_number"
                value={cartData.game_id}
                disabled
                variant="outlined"
              />
            </Grid>


            {/* Cart Number */}
            <Grid item xs={12}>
              <Autocomplete
                options={cartNumbers}
                renderInput={(params) => 
                <TextField {...params} label="Cart Number" 
                    error={!!errors.cart_number} // Pass error explicitly
                    helperText={errors.cart_number} // Pass helperText explicitly                
                />}
                value={cartData.cart_number}
                onChange={(e, newValue) => setCartData({ ...cartData, cart_number: newValue })}
              />
            </Grid>

            {/* Worker Selection */}
            <Grid item xs={12}>
            <Autocomplete
              multiple // Enable multiple selection
              options={workers}
              getOptionLabel={(option) => `${option.name} ${option.last_name}`}
              value={workers.filter(worker => cartData.worker_ids.includes(worker.worker_id))}
              onChange={handleWorkerChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Workers"
                  error={!!errors.worker_ids}
                  helperText={errors.worker_ids}
                />
              )}
            />
          </Grid>

            {/* Quantities Start */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantities Start"
                name="quantities_start"
                value={cartData.quantities_start}
                onChange={handleChange}
                variant="outlined"
                type="number"
                error={!!errors.quantities_start}
                helperText={errors.quantities_start ? errors.quantities_start : `equal to ${(cartData.quantities_start / 45).toFixed(2)} boxes`}
                />
            </Grid>

            {/* Quantities Added */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantities Added"
                name="quantities_added"
                value={cartData.quantities_added}
                onChange={handleChange}
                variant="outlined"
                type="number"
                error={!!errors.quantities_added}
                helperText={errors.quantities_added ? errors.quantities_added : `equal to ${(cartData.quantities_added / 45).toFixed(2)} boxes`}
              />
            </Grid>

            {/* Quantities Minus */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantities Minus"
                name="quantities_minus"
                value={cartData.quantities_minus}
                onChange={handleChange}
                variant="outlined"
                type="number"
                error={!!errors.quantities_minus}
                helperText={errors.quantities_minus ? errors.quantities_minus : `equal to ${(cartData.quantities_minus / 45).toFixed(2)} boxes`}
              />
            </Grid>

            {/* Final Quantity */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Returns"
                name="final_returns"
                value={cartData.final_returns}
                onChange={handleChange}
                variant="outlined"
                type="number"
                error={!!errors.final_returns}
                helperText={errors.final_returns ? errors.final_returns : `equal to ${(cartData.final_returns / 45).toFixed(2)} boxes`}
              />
            </Grid>

            {/* Total Vouchers */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Float"
                name="float"
                value={cartData.float}
                onChange={handleChange}
                variant="outlined"
                type="number"
                error={!!errors.float}
                helperText={errors.float}
              />
            </Grid>

            {/* Vouchers Value */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Workers Value"
                name="worker_total"
                value={cartData.worker_total}
                onChange={handleChange}
                variant="outlined"
                type="number"
                error={!!errors.worker_total}
                helperText={errors.worker_total}
              />
            </Grid>
          </Grid>
        </Box>
        </SwiperSlide>

        <SwiperSlide style={{maxHeight:'500px', overflow:'scroll'}}>
          <Typography sx={{fontWeight:800}}>Gazebo 1</Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{background:'gold'}}>
                <TableRow>
                  <TableCell>Cart</TableCell>
                  <TableCell>Boxes</TableCell>
                  <TableCell>Busy</TableCell>
                  <TableCell>Workers</TableCell>
                </TableRow>
              </TableHead>
              {gazebo_1.map(cart => (
                <TableRow key={cart.cart_number}>
                    <TableCell>{cart.cart_number}</TableCell>
                    <TableCell>{cart.normal_boxes_start} <Typography variant='caption' component='span'>({cart.normal_boxes_start * 45})</Typography></TableCell>
                    <TableCell>{formatBusy(cart)}</TableCell>
                    <TableCell>{cart.people === 1 ? <PersonIcon/> : <PeopleIcon />}</TableCell>
                </TableRow>
              ))}
            </Table>
          </TableContainer>

          <Divider sx={{mt:4}} />

          <Typography sx={{fontWeight:800, mt:1}}>Gazebo 2</Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{background:'gold'}}>
                <TableRow>
                  <TableCell>Cart</TableCell>
                  <TableCell>Boxes</TableCell>
                  <TableCell>Busy</TableCell>
                  <TableCell>Workers</TableCell>
                </TableRow>
              </TableHead>
              {gazebo_2.map(cart => (
                <TableRow key={cart.cart_number}>
                    <TableCell>{cart.cart_number}</TableCell>
                    <TableCell>{cart.normal_boxes_start} <Typography variant='caption' component='span'>({cart.normal_boxes_start * 45})</Typography></TableCell>
                    <TableCell>{formatBusy(cart)}</TableCell>
                    <TableCell>{cart.people === 1 ? <PersonIcon/> : <PeopleIcon />}</TableCell>
                </TableRow>
              ))}
            </Table>
          </TableContainer>

        </SwiperSlide>
        </Swiper>


      </DialogContent>
      <DialogActions sx={{ padding: 1 }}>
  {/* Main Container */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    {/* Navigation Buttons on the Left */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        className="custom-swiper-button-prev"
        variant="contained"
        sx={{ color: 'black', background:'gold', marginRight: 1 }}
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        className="custom-swiper-button-next"
        variant="contained"
        sx={{ color: 'black', background:'gold'}}
      >
        <ArrowRightIcon />
      </Button>
    </Box>

    {/* Action Buttons on the Right */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        onClick={onClose}
        variant="outlined"
        sx={{ color: 'gold', border: '1px solid gold', marginRight: 1 }}
      >
        Cancel
      </Button>
      <Button
        sx={{ background: 'gold', color: 'black', height: '35px' }}
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        disabled={loading}
      >
        {button}
      </Button>
    </Box>
  </Box>
</DialogActions>

    </Dialog>
  );
};

export default AddCart;
