import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Grid,
  Tooltip,
  Divider,
  LinearProgress,
  TextField,
  InputAdornment,
  FormControlLabel,
  CircularProgress
} from "@mui/material";
import { fetchAllWorkers, addToWatchList, removeFromWatchList } from "../endpoints/WorkersRoutes";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WorkerDetails from "./WorkerDetails";
import AddWorker from "./AddWorker";
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditWorker from "./EditWorker";
import HighlightIcon from '@mui/icons-material/Highlight';
import { Toaster, toast } from "sonner";
import EmailWorker from "./EmailWorker";
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import { useAuth } from '../../context/AuthContext'
import { findBestWorker } from "../utils/WorkersFunctions";
import { formatCurrency, formatMargin } from "../utils/AnalyticsFunctions";
import { IOSSwitch } from "../utils/Switch";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import Info from "@mui/icons-material/Info";


const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedWorkerEdit, setSelectedWorkerEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [emailWorker, setEmailWorker] = useState(null); // State for email view
  const [loading, setLoading] = useState(false)
  const [watching, setWatching] = useState()
  const [bestWorker, setBestWorker] = useState({})
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [watchBtn, setWatchBtn] = useState(<HighlightIcon />)
  const [unwatchBtn, setUnwatchBtn] = useState(<RemoveModeratorIcon />)

 
  const { user, checkAuthStatus, authenticated } = useAuth()

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = async (worker) => {
    const isAuthenticated = await checkAuthStatus();  // Check if authenticated
  
      if (!isAuthenticated) {
        console.log("User is not authenticated, aborting action.");
        return; // Stop the function if the user is not authenticated
      }

    setSelectedWorkerEdit(worker);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEmailOpen = (worker) => {

    if (user.user.access !== 'high'){
      toast.error('You do not have permission for this action', {
        description: `Today at ${new Date().toLocaleTimeString('eb-GB').slice(0, 5)}`,
        duration: 5000
      })
      return
    }

    setEmailWorker(worker);
  };

  const handleEmailClose = () => {
    setEmailWorker(null);
  };

  const startWatching = async (worker) => {
    setWatchBtn(<CircularProgress size={24} sx={{ color: 'black', position: 'absolute' }} />);
    setLoading(true);
  
    try {
   
      const response = await addToWatchList(worker.id);
      console.log(response);
  
      toast.success(`${worker.name} has been added to the watchlist!`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000,
      });

      setWatchBtn(<HighlightIcon />)
  
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  
  

  const stopWatching = async (worker) => {
    setUnwatchBtn(<CircularProgress size={24} sx={{ color: 'black', position: 'absolute' }} />);
    setLoading(true)


    try{
    
      const response = await removeFromWatchList(worker.id)
      console.log(response)
      toast.success(`${worker.name} has been removed from the watchlist!`, {
        description: `Todat at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      })
      setLoading(false)
      setChecked(false)
      setUnwatchBtn(<RemoveModeratorIcon />)
    }catch(e){
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetchAllWorkers();
        console.log(response, 'workers');
        if (response) {
          setWorkers(response.sort((a, b) => a.id - b.id));
          const bestWorker = findBestWorker(response)
          setBestWorker(bestWorker)
          const watching = response.filter(worker => worker.watching === true)
          setWatching(watching)
          setFilteredWorkers(response)
          setPageLoading(false)
          console.log(response, 'watching')
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, [open, openEdit, loading]);

  const numOfShifts = (worker) => (worker.carts ? worker.carts.length : 0);

  const handleBackToList = () => setSelectedWorker(null);

  useEffect(() => {
    if (input) {
      const filtered = workers.filter((worker) =>
        `${worker.name} ${worker.last_name}`.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(workers); // Reset to all workers when input is cleared
    }
  }, [input, workers]);

  useEffect(() => {
    if (checked) {
      const filtered = workers.filter(worker => worker.watching)
      setFilteredWorkers(filtered)
    } else {
      setFilteredWorkers(workers)
    }
  }, [checked])

  const isWatching = (worker) => {
    if (worker.watching) {
      return 'red'
    }
  }


  if (pageLoading) {
    return (
      <Box sx={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', position:'absolute', textAlign:'center'}}>
        <CircularProgress sx={{color:'grey'}} thickness={10} />
        <Typography sx={{color:'grey'}}>Fetching Data...</Typography>
      </Box>
    )
  }


  return (
    <>
      {!selectedWorker && !emailWorker ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ fontWeight: '800' }}>Workers</Typography>
            <Button onClick={handleOpen} variant="contained" sx={{ background: 'gold', color: 'black' }}>Add New Worker</Button>
          </Box>

          <AddWorker open={open} onClose={handleClose} />
          <EditWorker openEdit={openEdit} closeEdit={handleEditClose} selectedWorker={selectedWorkerEdit} />
          <Toaster />

{workers.length > 0 ? (
  <Grid container spacing={2}>
  {/* Left: Workers Table */}
  <Grid item xs={12} lg={8}>

    <Box sx={{mt:3}}>
      <Paper elevation={3} sx={{p:3}}>
        <TextField disabled={checked} fullWidth placeholder="Enter Worker Name" type="text" value={input} onChange={(e) => setInput(e.target.value)}
        error={filteredWorkers.length === 0}
        helperText={filteredWorkers.length === 0 ? 'No workers found, please refine your search' : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button sx={{ background: 'gold', color: 'black'}} disabled={input.length === 0} onClick={() => setInput('')}>
                {<ClearIcon/>}
              </Button>
            </InputAdornment>
          ),
        }}
        >
        </TextField>
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', mt:1, ml:1,}}>
          <Typography variant="subtitle2" sx={{color:'grey', alignContent:'center', display:'flex'}}>
            Show Watched Workers 
            <Tooltip arrow placement="right" title='Watched workers will appear red on Analytics and Events so you can easily identify them.'>
            <Info fontSize="small" sx={{ml:.5}}/>
            </Tooltip>
            </Typography>
          <FormControlLabel
          control={<IOSSwitch sx={{ m: 1 }} checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
          />
        </Box>
      </Paper>
    </Box>


    <Box sx={{ mt: 3, overflowX: 'auto' }}>
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', left: 0, zIndex: 10, background: 'white' }}>Name</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Shifts</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkers.map((worker) => (
              <TableRow key={worker.id}>
                <TableCell sx={{ position: 'sticky', left: 0, zIndex: 10, background: 'white', color: isWatching(worker)}}>
                  {worker.name} {worker.last_name.slice(0, 1)}
                  </TableCell>
                <TableCell>{new Date(worker.created_at).toLocaleDateString('en-GB')}</TableCell>
                <TableCell>{numOfShifts(worker)}</TableCell>
                <TableCell>
                  {/* Action Buttons */}
                  <Tooltip arrow title="View Profile">
                    <Button
                      onClick={() => setSelectedWorker(worker)}
                      sx={{ background: 'gold', color: 'black' }}
                      variant="contained"
                    >
                      <RemoveRedEyeIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip arrow title="Edit Profile">
                    <Button
                      onClick={() => handleEditOpen(worker)}
                      variant="contained"
                      sx={{ background: 'gold', color: 'black', ml: 2 }}
                    >
                      <EditNoteIcon />
                    </Button>
                  </Tooltip>


                  {worker.watching ? (
                    <Tooltip arrow title="Stop Watching">
                      <Button
                        onClick={() => stopWatching(worker)}
                        variant="contained"
                        sx={{ background: 'gold', color: 'black', ml: 2, height:'35px' }}
                        disabled={loading}
                      >
                        {unwatchBtn}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip arrow title="Start Watching">
                      <Button
                        onClick={() => startWatching(worker)}
                        variant="contained"
                        sx={{ background: 'gold', color: 'black', ml: 2, height:'35px' }}
                        disabled={loading}
                      >
                        {watchBtn}
                      </Button>
                    </Tooltip>


                  )}
                {/*}
                  <Tooltip arrow title="Email Worker">
                    <Button
                      onClick={() => handleEmailOpen(worker)}
                      variant="contained"
                      sx={{ background: 'gold', color: 'black', ml: 2 }}
                    >
                      <EmailIcon />
                    </Button>
                  </Tooltip>
                  */}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Grid>

  {/* Right: Stats Section */}
  <Grid item xs={12} lg={4} sx={{mt:3}}>
    <Grid container spacing={2}>

        {/* Watched Workers */}
        <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <FilterAltIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Filtered Workers</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            {filteredWorkers.length} of {workers.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(filteredWorkers.length / workers.length) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {((filteredWorkers.length / workers.length) * 100).toFixed(2)}%
          </Typography>
        </Paper>
      </Grid>


      {/* Total Workers */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Diversity3Icon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Total Workers</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            {workers.length} of 100
          </Typography>
          <LinearProgress
            variant="determinate"
            value={workers.length}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
          />
           <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {(workers.length).toFixed(2)}%
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <VisibilityIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Watched Workers</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            {watching?.length} of {workers.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(watching?.length / workers.length) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {((watching?.length / workers.length) * 100).toFixed(2)}%
          </Typography>
        </Paper>
      </Grid>

      {/* Best Worker */}
      {bestWorker?.margin !== 0 && (
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <StarIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Best Worker</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            {bestWorker.name} - {formatCurrency(bestWorker.amount)} of {formatCurrency(bestWorker.expected)} {formatMargin(bestWorker.margin - 100)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={bestWorker?.margin || 0}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {((bestWorker?.margin ? (bestWorker.margin).toFixed(2) : 'N/A' ))}%
          </Typography>
        </Paper>
      </Grid>
       )}
    </Grid>
  </Grid>
</Grid>   
) : (
  <Box sx={{mt:3}}>
    <Typography>Click <Button onClick={handleOpen} sx={{background:'gold', color:'black'}}>Here</Button> to add a new worker!</Typography>
 </Box>
)}       
        </>
      ) : (
        <WorkerDetails worker={selectedWorker} setSelectedWorker={setSelectedWorker} onBack={handleBackToList} />
      )}
    </>
  );
};


export default Workers;