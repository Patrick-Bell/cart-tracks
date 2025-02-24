import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, InputAdornment, CircularProgress } from "@mui/material";
import { Tooltip } from 'react-tippy';
import {Tooltip as Tip} from "@mui/material";
import 'react-tippy/dist/tippy.css'; // Ensure this CSS file is imported for tooltip styling
import AddCart from "./AddCart";
import { useState, useEffect } from "react";
import { getOneGame } from '../endpoints/GamesRoutes';
import { Toaster, toast } from 'sonner'
import InfoIcon from '@mui/icons-material/Info';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCart, getOneCart } from "../endpoints/CartRoutes";
import ConfirmDeleteCart from "./ConfirmDeleteCart";
import EditCart from "./EditCart";
import Check from "@mui/icons-material/Check";
import { markGameAsComplete } from "../endpoints/GamesRoutes";
import ConfirmSubmitGame from "./ConfirmSubmitGame";
import Games from "./Games";
import { useMediaQuery } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReactLoading from 'react-loading'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const GameDetail = ({ game, setSelectedGame }) => {
  const [open, setOpen] = useState(false);
  const [liveGame, setLiveGame] = useState(null);  // Start with null until the game data is loaded
  const [loading, setLoading] = useState(true);    // Track loading state
  const [error, setError] = useState(null);        // Track any error that occurs during the fetch
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedCartId, setSelectedCartId] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openSubmit, setOpenSubmit] = useState(false)
  const [cart, setCart] = useState(null)
  const [totalQuantities, setTotalQuantities] = useState({});
  const [submitBtn, setSubmitBtn] = useState("Submit")
  const [submitLoading, setSubmitLoading] = useState(false)
  const isLargeScreen = useMediaQuery('(min-width:600px)'); // This checks if the screen width is 600px or larger (adjust this to your needs)
  const [dataLoading, setDataLoading] = useState(false)
  const [cartOrder, setCartOrder] = useState('asc')

  const {mode} = useThemeContext()
  const {user} = useAuth()

console.log(game, 'game')

  // Step 1: Get all cart numbers from the carts
const diff = liveGame?.carts?.map(cart => cart.cart_number);

// Step 2: Get unique cart numbers using a Set
const uniqueCartNumbers = [...new Set(diff)];

// Step 3: Filter the carts to get only the ones with unique cart numbers
const filteredCarts = liveGame?.carts?.filter((cart, index, self) => {
  // Check if the current cart's cart_number is the first occurrence
  return self.findIndex(c => c.cart_number === cart.cart_number) === index;
});


useEffect(() => {
  const fetchGameAndCartData = async () => {
    if (!game?.id) return; // Exit early if game ID is undefined
    
    setDataLoading(true)

    try {
      const [gameData, cartData] = await Promise.all([
        getOneGame(game.id),
        cart?.id ? getOneCart(cart.id) : Promise.resolve(null), // Only fetch cart if ID exists
      ]);

      setLiveGame(gameData); // Update game state
      setCart(cartData || null); // Set cart to fetched data or null if not found
    } catch (e) {
      setError("Failed to load data");
      console.error(e);
    } finally {
      setLoading(false); // Always reset loading state
      setDataLoading(false)
    }
  };

  fetchGameAndCartData();
}, [game?.id, cart?.id, open, openSubmit, openConfirm, openEdit]);



useEffect(() => {
  if (liveGame?.carts?.length) {

  const carts = liveGame?.carts

    // Calculate the totals as before
    const totalStartedQuantities = carts.reduce((acc, cart) => acc + cart.quantities_start, 0);
    const totalFinalQuantites = carts.reduce((acc, cart) => acc + cart.final_quantity, 0);
    const totalFinalReturns = carts.reduce((acc, cart) => acc + cart.final_returns, 0);
    const finalActualValue = carts.reduce((acc, cart) => acc + cart.total_value, 0);
    const finalWorkerValue = carts.reduce((acc, cart) => acc + cart.worker_total, 0);
    const totalSold = carts.reduce((acc, cart) => acc + cart.sold, 0);

    // Set the totals and sorted carts
    setTotalQuantities({
      totalStartedQuantities,
      totalFinalQuantites,
      totalFinalReturns,
      finalActualValue,
      finalWorkerValue,
      totalSold,
    });

  }
}, [open, openSubmit, openConfirm, openEdit, loading, dataLoading]);


useEffect(() => {

  if (!liveGame?.carts) return; // Exit early if liveGame or liveGame.carts is null or undefined

  const cartNumbers = ["1", "2", "3", "4", "5", "7", "10", "BR2", "11", "14", "15", "16", "17", "Gazebo 1", "Gazebo 2"];

    // Create a map for quick lookup of cart_number index in cartNumbers array
    const cartNumberIndexMap = cartNumbers.reduce((acc, cartNumber, index) => {
      acc[cartNumber] = index;
      return acc;
    }, {});


    // Sort carts based on the custom order in cartNumbers
    const sortedCarts = [...liveGame.carts].sort((a, b) => {
      const indexA = cartNumberIndexMap[a.cart_number] ?? Infinity; // Default to Infinity if not found
      const indexB = cartNumberIndexMap[b.cart_number] ?? Infinity;
      return indexA - indexB;
    });

    if (cartOrder === 'asc') {
      setLiveGame((prev) => ({...prev, carts: sortedCarts}))
    } else if (cartOrder === 'desc') {
      setLiveGame((prev) => ({...prev, carts: [...sortedCarts].reverse()}))
    }


}, [cartOrder])

 
  // Format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Open the Add Cart Modal
  const handleOpen = () => {
    if (user?.user?.access === 'low') {
      toast.error(`You do not have permission for this action`, {
        duration: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 3000
      })
      return
    }
    setOpen(true);
  };

  // Close the Add Cart Modal
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenSubmit = () => {
    if (user?.user?.access === 'low') {
      toast.error(`You do not have permission for this action`, {
        duration: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 3000
      })
      return
    }
    setOpenSubmit(true);
  };

  // Close the Add Cart Modal
  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

  // Format the difference in returns
  const formatTotal = (totalValue, workerValue) => {
    const difference = (totalValue - workerValue).toFixed(2);
    const color = difference == 0 ? "grey" : (difference < 0 ? "green" : "red");
    return (
      <span style={{ color: color }}>
        £{Math.abs(difference).toFixed(2)}
      </span>
    );
  };

  const handleOpenConfirmDelete = (id) => {
    if (user?.user?.access === 'low') {
      toast.error(`You do not have permission for this action`, {
        duration: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 3000
      })
      return
    }

    setSelectedCartId(id)
    setOpenConfirm(true)
  }

  const onClose = () => setOpenConfirm(false);

  const handleEditOpen = (cart) => {
    if (user?.user?.access === 'low') {
      toast.error(`You do not have permission for this action`, {
        duration: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 3000
      })
      return
    }

    setCart(cart)
    setOpenEdit(true)
  }
  const handleEditClose = () => {
    setOpenEdit(false)
  }


  const deleteOneCart = async (id) => {
    try{
      const response = await deleteCart(id)
      setCart(null)
      onClose()
      toast.success(`Cart Removed Successfully!`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      });
    }catch(e){
      console.log(e)
    }
  }

  const markGame = async (liveGame) => {
    setSubmitBtn(<CircularProgress size={24} sx={{ color: 'black', position: 'absolute' }} />);
    setSubmitLoading(true)
    try{
      const response = await markGameAsComplete(liveGame.id)
      toast.success(`The game ${liveGame.name} has been marked as complete..`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 10000
      })
      handleCloseSubmit()
      setSubmitLoading(false)
      setSubmitBtn('Submit')
    }catch(e){
      console.log(e)
    }
  }

  const showGames = () => {
    setSelectedGame(null)
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
};

  // Conditional rendering to handle loading and errors
  if (loading) {
    return (
      <Box
        sx={{
          top: '50%',
          left: { xs: '50%', sm: 'calc(50% + 120px)' }, // Offset left for small screens, centered for larger screens
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          textAlign: 'center',
        }}>
        <CircularProgress sx={{color:'grey'}} thickness={10} />
        <Typography sx={{color:'grey'}}>Fetching Data...</Typography>
      </Box>
    )
  }

  if (dataLoading) {
    return (
      <Box
        sx={{
          top: '50%',
          left: { xs: '50%', md: 'calc(50% + 120px)' }, // Offset left for small screens, centered for larger screens
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          textAlign: 'center',
        }}
      >  
      <Typography sx={{color:'grey', display:'flex', alignItems:'center'}}>Performing Action <ReactLoading type="bubbles" color="grey" height={50} width={50} /></Typography>
      </Box>
    )
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!liveGame) {
    return <Typography>No game found, please try again.</Typography>; // If game is not found or no data is available
  }

  const getWorkersCount = (game) => {
    let workerCount = 0;
  
    // Loop through each cart in the game
    game.carts?.forEach((cart) => {
      if (cart.workers && cart.workers.length > 0) {
        workerCount += cart.workers.length; // Add the number of workers in this cart
      }
    });
  
    return workerCount;
  };


  return (
    <Box sx={{ padding: 0 }}> {/* Adjust padding of the Box component */}
      {/* Add Cart Modal */}
      <AddCart open={open} onClose={handleClose} game={liveGame} setLiveGame={setLiveGame} />
      <EditCart game={cart} open={openEdit} onClose={handleEditClose} gameId={liveGame}/>

      <ConfirmDeleteCart onClose={onClose} openConfirm={openConfirm} deleteOneCart={deleteOneCart} selectedCartId={selectedCartId} />
      <ConfirmSubmitGame gameId={liveGame} submitGame={markGame} liveGame={liveGame} openSubmit={openSubmit} onClose={handleCloseSubmit} button={submitBtn} loading={submitLoading}  />

      <Toaster/>

      {/* Game Information Table */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', m:1}}>
          <Typography variant="h6" color="textSecondary" gutterBottom>Game Summary</Typography>
          <Button variant="contained" onClick={showGames} sx={{right:'10px', background:'gold', color:'black'}}>Go Back</Button>
          </Box>
          <Box sx={{ mt: 3, overflowX: 'auto'}}> {/* Horizontal scroll container */}
          <TableContainer sx={{width: '100%'}} component={Paper}>
            <Table sx={{ border: 'none' }}> {/* Set border to none for the table */}
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: 'none' }}>Match</TableCell>
                  <TableCell sx={{ border: 'none' }}>{liveGame?.name.split('-')[0]}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ border: 'none' }}>Game Date</TableCell>
                  <TableCell sx={{ border: 'none' }}>{formatDate(liveGame.date)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: 'none' }}>Manager</TableCell>
                  <TableCell sx={{ border: 'none' }}><strong>{liveGame.manager.name}</strong> - {liveGame.manager.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: 'none' }}>Action(s)</TableCell>
                  <TableCell sx={{ border: 'none', display:'flex' }}>
                    {/* If game.complete_status is false, show this button */}
                    {liveGame.complete_status === false ? (
                      <Box
                        sx={{
                          display:'flex',
                          alignItems: 'center',
                          color: 'white',
                        }}
                      >
                        <Tip arrow title='Click to add a chariot.'>
                        <Button
                      variant="contained"
                      sx={{
                        background: 'gold',
                        color: 'black',
                        display: game.complete_status ? 'none' : 'flex', // Conditionally hide or show
                      }}
                      onClick={handleOpen} // Your function for opening the modal or action
                    >
                      <AddShoppingCartIcon />
                    </Button>
                    </Tip>
                      <Tip arrow title='Click to submit job. A downloadable PDF summary will become available on the events page.'>
                        <Button
                        variant="contained"
                          sx={{ background: 'gold', color: 'black', ml:2 }}
                          onClick={handleOpenSubmit}
                        >
                          <Check /> {/* Check Icon inside button */}
                        </Button>
                        </Tip>
                      </Box>
                    ) : (
                      <>
                      <Typography sx={{fontSize:'14px'}}>Game has been marked as completed.</Typography>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Cart Information Table */}
      {liveGame.carts.length > 0 ? (
      <Card sx={{ marginBottom: 3 }}>
        <Typography sx={{ p: 2, display:'flex', alignItems:'center' }} variant="h6" gutterBottom>Cart Information</Typography>
        <CardContent>
        <Box sx={{overflowX: 'auto'}}> {/* Horizontal scroll container */}
        <TableContainer sx={{width:'100%'}}>
            <Table sx={{ border: 'none', minWidth: 650 }}> {/* Set border to none for the table */}
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: 'none', fontWeight:'800', position: 'sticky', left: 0, zIndex: 10, bgcolor: mode === 'dark' ? '#2D2D2D' : '#f5f5f5', display:'flex', cursor:'pointer'}}>Cart number
                  <ArrowCircleUpIcon
                      sx={{
                        transform: cartOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease'
                      }}
                      onClick={() => setCartOrder(cartOrder === 'desc' ? 'asc' : 'desc') }
                    />
                  </TableCell>
                  <TableCell sx={{ border: 'none', fontWeight:'800' }}>Quantities Start</TableCell>
                  <TableCell sx={{ border: 'none', fontWeight:'800', display:'flex', cursor:'pointer' }}>Final Quantity <Tooltip arrow title={`<strong>Final Quantity</strong> & <strong>Quantities Start</strong> should be equal to show stock movements correctly.`}><InfoIcon /></Tooltip></TableCell>
                  <TableCell sx={{ border: 'none', fontWeight:'800' }}>Final Returns</TableCell>
                  <TableCell sx={{ border: 'none', fontWeight:'800'}}>Sold</TableCell>
                  <TableCell sx={{ border: 'none', fontWeight:'800', display:'flex', cursor:'pointer' }}>Margin (£) <Tooltip arrow title={`<strong>Expected Value:</strong> Sold * 4<br><strong>Returned Value:</strong> What worker returned (- float)<br><strong>Margin:</strong> Worker Value - Expected Value`}><InfoIcon /></Tooltip></TableCell>
                  <TableCell sx={{ border: 'none', fontWeight:'800' }}>Worker(s)</TableCell>
                  {liveGame.complete_status === false && (
                  <TableCell sx={{ border: 'none', fontWeight:'800' }}>Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {liveGame?.carts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell sx={{ border: 'none', position: 'sticky', left: 0, zIndex: 10, bgcolor: mode === 'dark' ? '#2D2D2D' : '#f5f5f5'}}>{cart.cart_number}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{cart.quantities_start} ({(cart.quantities_start / 45).toFixed(2)} boxes)</TableCell>

                      <TableCell sx={{border: 'none'}}>
                    <Tooltip position="left" arrow title={`Quantities Added: <strong>${cart.quantities_added}</strong><br>Quantities Minus: <strong>${cart.quantities_minus}</strong>`}>
                      <Typography variant="subtitle2" sx={{ border: 'none', cursor:'pointer' }}>{cart.final_quantity}</Typography>
                    </Tooltip>
                    </TableCell>
                    
                    
                    <TableCell sx={{ border: 'none' }}>{cart.final_returns}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{cart.sold}</TableCell>

                    <TableCell sx={{border: 'none'}}>
                    <Tooltip 
                        title={`Cart <strong>${cart.cart_number}</strong><hr> Expected: <strong>£${(cart.total_value).toLocaleString()}</strong><br>Returned: <strong>£${(cart.worker_total).toLocaleString()}</strong>`} 
                        arrow 
                        position="left"
                      >
                    <Typography variant="subtitle2" sx={{ border: 'none', cursor:'pointer' }}>{formatTotal(cart.total_value, cart.worker_total)}</Typography>
                    </Tooltip>
                    </TableCell>


                    <TableCell sx={{ border: 'none' }}>
                      {cart.workers.length > 0
                        ? cart.workers.map((worker, index) => (
                            <span
                              key={worker.id}
                              style={{
                                color: worker.watching ? 'red' : 'inherit', // Highlight in red if the worker is on the watchlist
                                fontWeight: worker.watching ? 'bold' : 'normal', // Optional styling for watched workers
                              }}
                            >
                              {worker.name}
                              <span style={{color:'black'}}>{index < cart.workers.length - 1 ? ', ' : ''}</span>
                            </span>
                          ))
                        : 'N/A'}
                    </TableCell>

                      {liveGame.complete_status === false && (
                        <TableCell sx={{ border: 'none', display:'flex' }}>
                        <Tip arrow title={`Click to edit cart ${cart.cart_number}`}>
                        <Button onClick={() => handleEditOpen(cart)} variant="contained" sx={{background:'gold', color:'black'}}> <EditNoteIcon /></Button>
                        </Tip>
                        <Tip arrow title={`Click to delete cart ${cart.cart_number}`}>
                        <Button onClick={() => handleOpenConfirmDelete(cart.id)} variant="contained" sx={{background:'gold', color:'black', ml:2}}> <DeleteIcon /></Button>
                        </Tip>
                      </TableCell>
                      ) }
                  </TableRow>
                ))}
                  <TableRow sx={{borderTop:"1px solid lightgrey"}}>
                    <TableCell sx={{ border: 'none', position: 'sticky', left: 0, zIndex: 10, bgcolor: mode === 'dark' ? '#2D2D2D' : '#f5f5f5' }}>{uniqueCartNumbers.length}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{totalQuantities.totalStartedQuantities} ({(totalQuantities.totalStartedQuantities / 45).toFixed(2)} boxes)</TableCell>
                    <TableCell sx={{ border: 'none' }}>{totalQuantities.totalFinalQuantites}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{totalQuantities.totalFinalReturns}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{totalQuantities.totalSold}</TableCell>

                    <TableCell sx={{border:'none'}}>
                    <Tooltip
                    arrow
                    position="left"
                    title={`Overall <hr>What should be returned: <strong>${formatCurrency(totalQuantities.finalActualValue)}</strong><br>What the workers returned: <strong>${formatCurrency(totalQuantities.finalWorkerValue)}</strong>`}
                    >
                    <Typography variant="subtitle2" sx={{cursor:'pointer' }}>{formatTotal(totalQuantities.finalActualValue, totalQuantities.finalWorkerValue)}</Typography>
                    </Tooltip>
                    </TableCell>


                    <TableCell sx={{ border: 'none' }}>{getWorkersCount(liveGame)}</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </CardContent>
      </Card>
      ) : (
        <Box>
          <Paper elevation={3}>
          <Typography sx={{p:3}}>Please click <Button onClick={handleOpen} sx={{background:'gold', color:'black'}}>here</Button> to add a new cart</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default GameDetail;
