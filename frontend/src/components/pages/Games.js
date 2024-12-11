import { useState, useEffect } from "react";
import { Box, Button, Typography, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Paper, Tooltip, Grid, LinearProgress, TextField, InputAdornment, FormControlLabel, CircularProgress } from "@mui/material";
import { fetchAllGames } from "../endpoints/GamesRoutes";
import GameDetail from "./GameDetail";
import AddGame from "./AddGame";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { generateGameSummaryPDF } from "../utils/Pdf";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteGameModal from "./DeleteGameModal";
import { deleteSingleGame } from "../endpoints/GamesRoutes";
import { Toaster, toast } from "sonner";
import { useAuth } from '../../context/AuthContext'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { IOSSwitch } from "../utils/Switch";
import ClearIcon from '@mui/icons-material/Clear';
import { getFixtures } from "../endpoints/Fixures";
import {useThemeContext} from "../../context/ThemeContext";




const Games = () => {
  const [games, setGames] = useState([]); // State to store fetched games
  const [selectedGame, setSelectedGame] = useState(null); // Use `null` instead of empty array for clarity
  const [open, setOpen] = useState(false)
  const [deleteGameModal, setDeleteGameModal] = useState(false)
  const [game, setGame] = useState(null)
  const { user, checkAuthStatus } = useAuth()
  const [input, setInput] = useState('')
  const [filteredGames, setFilteredGames] = useState([])
  const [checked, setChecked] = useState({
    completed: false,
    upcoming: false,
  });
  const [fixtures, setFixtures] = useState([])
  const [team, setTeam] = useState({
    home_team: '',
    away_team: ''
  })
  const [pageLoading, setPageLoading] = useState(true)
  const [month, selectMonth] = useState("0")
  const { mode } = useThemeContext()


const fetchFixtures = async () => {
  const response = await getFixtures()
  console.log(response, 'games fixtures abb')
  setFixtures(response.filter(match => match.home_team === "West Ham United"))
}
  

  const handleOpen = async () => {
    const isAuthenticated = await checkAuthStatus();  // Check if authenticated
  
    if (!isAuthenticated) {
      console.log("User is not authenticated, aborting action.");
      return; // Stop the function if the user is not authenticated
    }
    setOpen(true);
  };

  // Close the Add Cart Modal
  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    // Fetch games data from the API
    const fetchGames = async () => {
      try {
        await fetchFixtures()
        const response = await fetchAllGames();
        const sorted = response.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (response) {
          setGames(sorted); // Store the fetched games in state
          setFilteredGames(sorted)
          setPageLoading(false)
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames(); // Call the fetch function when the component mounts
  }, [open, selectedGame, deleteGameModal]); // Empty dependency array ensures this runs only once on mount

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
  

  const handleOpenDeleteModal = async (game) => {
    if(user?.user.access !== 'low') {
      toast.error(`You do not have permission for this action`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      })
      return
    }

    setGame(game)
    console.log(game)
    setDeleteGameModal(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteGameModal(false)
  }

  // Format the date for better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Adjust based on your preferred locale
  };

  const deleteGame = async (gameId) => {
    try{
      const response = await deleteSingleGame(gameId)
      setDeleteGameModal(false)
      toast.success(`Game deleted successfully!`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      })
    }catch(e){
      console.log(e)
    }
  }

  const viewSelectedGame = async (game) => {
  
    setSelectedGame(game)
  }


  useEffect(() => {
    const applyFilters = () => {
      let filtered = games;
  
      // Apply text input filter
      if (input.trim()) {
        filtered = filtered.filter((game) =>
          game.name.toLowerCase().includes(input.toLowerCase())
        );
      }
  
      // Independent toggle filters
      const now = new Date();
  
      // If 'Completed Games' toggle is active
      if (checked.completed) {
        filtered = filtered.filter((game) => game.complete_status == true);
      }
  
      // If 'Upcoming Games' toggle is active
      if (checked.upcoming) {
        filtered = filtered.filter((game) => new Date(game.date) > now);
      }

      if (month !== "0") {
        const selectedMonth = parseInt(month, 10); // Convert string to number
        filtered = filtered.filter(
          (game) => new Date(game.date).getMonth() + 1 === selectedMonth
        );
      }
  
      setFilteredGames(filtered);
    };
  
    applyFilters();
  }, [input, checked, games, month]); // Trigger filtering whenever input, toggles, or games change


  const handleReset = () => {
    setChecked({
      completed: false,
      upcoming: false,
    });
    setInput('');
    console.log('Checked state after reset:', {
      completed: false,
      upcoming: false,
    });
    selectMonth("0")
  };

  const extractAbbreviation = (gameName) => {
    // Find the fixture based on the gameName
    const match = fixtures.find(fixture => fixture.name === gameName); // Use `.find()` to get a single match
  
    // If a match is found, return the abbreviations and icons
    if (match) {
      return (
        <Box sx={{display:'flex', alignItems:'center'}}>
          <img src={match.home_icon} alt={`${match.home_team_abb} icon`} style={{ width: 30, height: 30, marginRight: 5,}} />
          <span>{match.home_team_abb} <span style={{margin: '0 5px'}}>v</span> {match.away_team_abb}</span>
          <img src={match.away_icon} alt={`${match.away_team_abb} icon`} style={{ width: 30, height: 30, marginLeft: 5 }} />
        </Box>
      );
    }
  
    // If no match is found, return null or an appropriate value
    return null;
  };


  const handleMonthChange = (e) => {
    selectMonth(e.target.value)
    console.log(e.target.value)
  }
  
  

  // Calculate total stats for "Total Matches", "Total Workers", "Total Managers"
  const totalMatches = games.reduce((acc, game) => acc + game.carts.length, 0);
  const totalWorkers = games.reduce((acc, game) => acc + getWorkersCount(game), 0);
  const totalManagers = 8; // You can adjust this based on your data, or fetch it dynamically

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
      {!selectedGame ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth:'100%' }}>
            <Typography variant="h4" sx={{ fontWeight: '800' }}></Typography>
            <Button variant='contained' sx={{ background: 'gold', color: 'black' }} onClick={handleOpen}>Add New Event</Button>
          </Box>

          <AddGame open={open} onClose={handleClose}/>
          <DeleteGameModal openDelete={deleteGameModal} deleteClose={handleCloseDeleteModal} deleteOneGame={deleteGame} game={game} />
          <Toaster/>

          {/* Table Section - Display Game Data */}
          {games.length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12} lg={8}>

              <Box sx={{mt:3}}>
      <Paper elevation={3} sx={{p:3}}>
      <TextField
  fullWidth
  placeholder="Enter Game Name"
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  error={filteredGames.length === 0}
  helperText={
    filteredGames.length === 0 ? 'No games found, please refine your search' : ''
  }
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <Tooltip title={'Click to reset filters'} arrow placement="bottom">
        <Button
          sx={{ background: 'gold', color: 'black' }}
          onClick={handleReset}
        >
          <ClearIcon />
        </Button>
        </Tooltip>
      </InputAdornment>
    ),
  }}
/>

        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', mt:1, ml:1}}>
          <Typography variant="subtitle2" sx={{color:'grey'}}>Show Upcoming Games</Typography>
          <FormControlLabel
          control={<IOSSwitch sx={{ m: 1 }} checked={checked.upcoming}  onChange={(e) =>
            setChecked((prev) => ({ ...prev, upcoming: e.target.checked }))
          }/>}
          />
        </Box>
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', mt:1, ml:1}}>
          <Typography variant="subtitle2" sx={{color:'grey'}}>Show Completed Games</Typography>
          <FormControlLabel
          control={<IOSSwitch sx={{ m: 1 }} checked={checked.completed}  onChange={(e) =>
            setChecked((prev) => ({ ...prev, completed: e.target.checked }))
          } />}
          />
        </Box>
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', mt:1, ml:1}}>
          <Typography variant="subtitle2" sx={{color:'grey'}}>Show Month</Typography>
          <select value={month} onChange={handleMonthChange} style={{ padding: '4px', borderRadius: '4px' }}>
                        <option value="0">All</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
              </Box>
            </Paper>
          </Box>
            <Box sx={{ mt: 3, overflowX: 'auto'}}> {/* Horizontal scroll container */}
              <TableContainer component={Paper} sx={{ width: '100%'}}> {/* Keep table within the container */}
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ position: 'sticky', left: 0, zIndex: 10, bgcolor: mode === 'dark' ? '#2D2D2D' : '#f5f5f5' }}>Event</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Workers</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGames.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell sx={{ position: 'sticky', left: 0, zIndex: 10, bgcolor: mode === 'dark' ? '#2D2D2D' : '#f5f5f5'}}>
                        {extractAbbreviation(game.name)}
                    </TableCell>
                        <TableCell>{formatDate(game.date)}</TableCell>
                        <TableCell>{getWorkersCount(game)}</TableCell> {/* Show number of workers */}
                        <TableCell>
                          <Tooltip title='View Event' arrow>
                            <Button 
                              variant="contained"
                              onClick={() => viewSelectedGame(game)} 
                              sx={{ background: "gold", color: 'black' }}>
                              <VisibilityIcon/>
                            </Button>
                          </Tooltip>
                          {game.complete_status && (
                            <Tooltip title='Download Event' arrow>
                              <Button 
                                variant="contained"
                                onClick={() => generateGameSummaryPDF(game)} 
                                sx={{ background: "gold", color: 'black', ml:2 }}>
                                <DownloadIcon />
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip title='Delete Game' arrow>
                            <Button 
                              variant="contained"
                              onClick={() => handleOpenDeleteModal(game)} 
                              sx={{ background: "gold", color: 'black', ml:2 }}>
                              <DeleteIcon />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            </Grid>

            <Grid item xs={12} lg={4} sx={{mt:3}}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
          <FilterAltIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Filtered Games</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
           {filteredGames.length} of {games.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(filteredGames.length / games.length) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {((filteredGames.length / games.length) * 100).toFixed(2)}%
          </Typography>
        </Paper>

                </Grid>

                <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
          <FilterAltIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Season Games</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
           {games.length} of {fixtures.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(games.length / fixtures.length) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {((games.length / fixtures.length) * 100).toFixed(2)}%
          </Typography>
        </Paper>

                </Grid>

                <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
          <FilterAltIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px'}} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Best Game</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
           You must submit 5 games to activate this stat
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(games.length / games.length) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {((games.length / games.length) * 100).toFixed(2)}%
          </Typography>
        </Paper>

                </Grid>



              </Grid>
            </Grid>


            </Grid>
          ) : (
            <Box sx={{mt:3}}>
              <Typography>Click <Button onClick={handleOpen} sx={{background:'gold', color:'black'}}>Here</Button> to add a new game!</Typography>
            </Box>
          )}
        </>
      ) : (
        <GameDetail game={selectedGame} setSelectedGame={setSelectedGame} />
      )}
    </>
  );
}

export default Games;
