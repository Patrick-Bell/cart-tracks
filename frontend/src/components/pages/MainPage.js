import React, { useEffect, useState } from 'react';
import { Button, Modal, Box, Typography, Autocomplete, TextField, Grid, Paper, Divider, TableContainer, Table, TableHead, TableRow, TableCell, Select, MenuItem, FormControlLabel, Tooltip, Avatar, LinearProgress, CircularProgress } from '@mui/material';
import { premierLeagueTeams } from '../utils/Teams'; // Your teams data
import { addFixture, getFixtures, getNext3Games } from '../endpoints/Fixures';
import { fetchAllWorkers } from '../endpoints/WorkersRoutes';
import { fetchAllGames } from '../endpoints/GamesRoutes';
import { fetchAllManagers, fetchOneManager } from '../endpoints/ManagersRoutes';
import { useAuth } from "../../context/AuthContext"; // Assuming you're using context for auth
import FixtureCountDown from '../utils/FixtureCountDown'
import InfoIcon from '@mui/icons-material/Info'
import { IOSSwitch } from '../utils/Switch';
import { ThemeToggleBtn } from '../utils/ThemeToggleBtn'
import { enableNotifications, disableNotifications } from '../endpoints/ManagersRoutes';
import { Toaster, toast } from 'sonner'
import { getNextMonthGames } from '../endpoints/Fixures';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import GameModal from './GameModal';
import fallbackPic from '../assets/fallback-pic.png'
import { useThemeContext } from '../../context/ThemeContext';
import Calendar from 'react-awesome-calendar'
import FixturesPage from './FixturesPage';
import SendIcon from '@mui/icons-material/Send';



const MainPage = () => {
    const [open, setOpen] = useState(false);
    const [homeTeam, setHomeTeam] = useState(null);
    const [awayTeam, setAwayTeam] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [date, setDate] = useState('');
    const [workersWatch, setWatchlistWorkers] = useState([])
    const [workers, setWorkers] = useState([])
    const [managers, setManagers] = useState([])
    const [games, setGames] = useState([])
    const { user } = useAuth();
    const [competition, setCompetition] = useState('')
    const [checked, setChecked] = useState(user?.user.notifications)
    const [themeCheck, setThemeCheck] = useState('light')
    const [nextMonthGames, setNextMonthGames] = useState(0)
    const [homeGames, setHomeGames] = useState(0)
    const [incompleteGames, setInCompleteGames] = useState([])
    const [pageLoading, setPageLoading] = useState(true)
    const [showFixtures, setShowFixtures] = useState(false)

    const { mode, toggleTheme } = useThemeContext()

    const link = 'https://www.google.co.uk/maps/place/London+Stadium/@51.5386778,-0.0190346,17z/data=!3m1!4b1!4m6!3m5!1s0x48761d6975e8b559:0xe7fca44605b6ce94!8m2!3d51.5386745!4d-0.0164597!16zL20vMDZzdGxx?entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D'

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

      const handleToggle = async (event) => {
        const newValue = event.target.checked;
        const userId = user?.user.id
        if (checked !== newValue) {
          setChecked(newValue); // Optimistically update state immediately to reflect the change
      
          try {
            let response;
            if (newValue === true) {
              response = await enableNotifications(userId);  // Enable notifications
              toast.success(`Notificated enabled!`, {
                description: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
                duration: 3000
              })
            } else {
              response = await disableNotifications(userId);  // Disable notifications
              toast.success(`Notificated disabled!`, {
                description: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
                duration: 3000
              })
            }
      
            // Check if the response is successful and proceed accordingly
            if (response) {
              setChecked(newValue);  // Update state based on the response
            } else {
              console.error("Failed to update notifications:", response.errors || response.message);
              setChecked(!newValue);  // Reset toggle if the API fails
            }
          } catch (error) {
            console.error("Error toggling notifications:", error);
            setChecked(!newValue);  // Reset toggle in case of an error
          }
        }
      };
      


    useEffect(() => {
        const fetchFixtures = async () => {
            try {
                const response = await getNext3Games();
                setFixtures(response); // Set fixtures once data is fetched

                const workerResponse = await fetchAllWorkers()
                setWorkers(workerResponse)
                const workersWatch = workerResponse.filter(worker => worker.watching === true)
                setWatchlistWorkers(workersWatch)

                const managers = await fetchAllManagers()
                setManagers(managers)

                const games = await fetchAllGames()
                setGames(games)
                const incomplete = games.filter(game => game.complete_status === true)
                setInCompleteGames(incomplete)

                const notifications = user?.user.notifications
                setChecked(notifications)

                const nextMonthFixtures = await getNextMonthGames()
                setNextMonthGames(nextMonthFixtures.length)
                const homeGames = nextMonthFixtures.filter(game => game.home_team === "West Ham United")
                setHomeGames(homeGames.length)

                setPageLoading(false)

                setThemeCheck(mode)


            } catch (error) {
                console.error("Error fetching fixtures:", error);
            }
        };
        fetchFixtures(); // Call the function to fetch data
    }, []);

    useEffect(() => {
        setThemeCheck(mode)
    }, [mode])

    const handleSubmit = async () => {
        const data = {
            home_team: homeTeam.name,
            away_team: awayTeam.name,
            stadium: homeTeam.stadium,
            capacity: homeTeam.capacity,
            date: date,
            home_team_abb: homeTeam.abbreviation,
            away_team_abb: awayTeam.abbreviation,
            competition: competition
        };

        try {
            const response = await addFixture(data);
        } catch (e) {
            console.log(e);
        }
    };


    const retrieveImage = (homeTeam) => {
        const teams = premierLeagueTeams

        const badge = teams.find(team => team.name === homeTeam)

        return badge.badge
    }


    if (pageLoading) {
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
    
            return (
                <>
                {showFixtures ? (
                    <>
                    <FixturesPage setShowFixture={setShowFixtures} />
                    </>
                ):(
                    <Box>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb:2 }} elevation={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                    {/* User Avatar */}
                    <Avatar 
                    src={user?.picture_url || fallbackPic} 
                    alt={user?.user.name} 
                    sx={{ width: 40, height: 40, mr: 2 }} 
                    />
                    
                    {/* User Info */}
                    <Typography variant="body1">
                    Currently logged in as <strong>{user?.user.name} {user?.user.last_name}</strong>
                    </Typography>

                </Box>
                </Paper>


            <Grid container spacing={2}>
            {/* Watched Workers */}
            <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
            <VisibilityIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
            <Typography sx={{ fontWeight: 700, mt: 1 }}>Total Workers</Typography>
            <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
                {(workersWatch?.length)} of {workers.length} are being watched
            </Typography>
            <LinearProgress
                variant="determinate"
                value={((workersWatch.length) / workers.length) * 100}
                sx={{
                mt: 2,
                height: 10,
                borderRadius: '10px',
                background: 'lightyellow',
                '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
                }}
            />
            <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
            {(((workersWatch.length) / workers.length) * 100).toFixed(2)} %
            </Typography>
            </Paper>
            </Grid>



        <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
        <VisibilityIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
        <Typography sx={{ fontWeight: 700, mt: 1 }}>Total Events</Typography>
        <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            {(incompleteGames?.length)} of {games.length} games completed
        </Typography>
        <LinearProgress
            variant="determinate"
            value={((incompleteGames.length) / games.length) * 100}
            sx={{
            mt: 2,
            height: 10,
            borderRadius: '10px',
            background: 'lightyellow',
            '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
        />
        <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
        {(((incompleteGames.length) / games.length) * 100).toFixed(2)} %
        </Typography>
        </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
        <VisibilityIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
        <Typography sx={{ fontWeight: 700, mt: 1 }}>Games Next Month</Typography>
        <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            {(homeGames)} of {nextMonthGames} are home games
        </Typography>
        <LinearProgress
            variant="determinate"
            value={((homeGames) / nextMonthGames) * 100}
            sx={{
            mt: 2,
            height: 10,
            borderRadius: '10px',
            background: 'lightyellow',
            '& .MuiLinearProgress-bar': { backgroundColor: 'gold' },
            }}
        />
        <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
        {(((homeGames) / nextMonthGames) * 100).toFixed(2)} %
        </Typography>
        </Paper>
        </Grid>

    {/* Upcoming Fixtures Section */}
    <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
            <Grid container spacing={2}>
                {fixtures.length > 0 ? (
                    fixtures.map((fixture, index) => (
                        <>
                        <Grid item xs={12} md={4} key={index}>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    m: 1,
                                    padding: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            style={{
                                                height: '40px',
                                                margin: '0 5px',
                                                maxWidth: '100%',
                                            }}
                                            src={retrieveImage(fixture.home_team)}
                                            alt="Home Icon"
                                        />
                                        <Typography>{fixture.home_team_abb}</Typography>
                                    </Box>
                                    <Box>V</Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography>{fixture.away_team_abb}</Typography>
                                        <img
                                            style={{
                                                height: '40px',
                                                margin: '0 5px',
                                                maxWidth: '100%',
                                            }}
                                            src={retrieveImage(fixture.away_team)}
                                            alt="Away Icon"
                                        />
                                    </Box>
                                </Box>
                                <Divider sx={{ width: '100%', mt: 1 }} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        mt: 1,
                                    }}
                                >
                                    <Typography variant="subtitle2">Date</Typography>
                                    <Typography variant="subtitle2">
                                        {new Date(fixture.date).toLocaleDateString('en-GB').slice(0, 10)}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="subtitle2">Time</Typography>
                                    <Typography variant="subtitle2">
                                        {new Date(fixture.date).toLocaleTimeString('en-GB').slice(0, 5)}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="subtitle2">Stadium</Typography>
                                    <Typography variant="subtitle2">{fixture.stadium}</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="subtitle2">Competition</Typography>
                                    <Typography variant="subtitle2">{fixture.competition}</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="subtitle2">Time Left</Typography>
                                    <Typography variant="subtitle2"> <FixtureCountDown date={fixture.date} /></Typography>
                                </Box>
                            </Box>
                        </Grid>
                        </>
                        
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', margin: 'auto auto' }}>
                        No upcoming fixtures.
                    </Typography>
                )}
            </Grid>
        </Paper>
    </Grid>

        
        <Toaster />


    <Grid item xs={12} sm={8}>

    <Grid sx={{mt:2}}>
                <Paper sx={{p:2}}>
                    <Typography>Fixtures</Typography>
                    <Box sx={{mt:1, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <Box sx={{display:'flex'}}><Typography variant='subtitle2'>View all fixtures</Typography> 
                    </Box>
                    <Typography onClick={() => setShowFixtures(true)} sx={{m:1, cursor:'pointer', "&:hover":{ color:'#d4af37'}}} variant='subtitle2'><SendIcon /></Typography>
                    </Box>
                </Paper>
            </Grid>
        
            <Grid sx={{mt:2}}>
                <Paper sx={{p:2}}>
                    <Typography>Notifications</Typography>
                    <Box sx={{mt:1, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <Box sx={{display:'flex'}}><Typography variant='subtitle2'>Email Notifications</Typography> 
                    <Tooltip arrow placement='right' title='Emails include: Upcoming Fixtures Reminders, New Managers Added, Completed Games Reports, Monthly Summary Reports'>
                    <InfoIcon sx={{marginLeft:'5px'}} fontSize='small' />
                    </Tooltip>
                    </Box>
                    <FormControlLabel
                        control={<IOSSwitch sx={{ m: 1 }} checked={checked} disabled onChange={handleToggle} />}
                    />
                    </Box>
                </Paper>
            </Grid>

            <Grid sx={{mt:2}}>
                <Paper sx={{p:2}}>
                    <Typography>Theme</Typography>
                    <Box sx={{mt:1, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <Box sx={{display:'flex'}}><Typography variant='subtitle2'>Toggle Theme</Typography> 
                    </Box>
                    <FormControlLabel
                        control={<ThemeToggleBtn sx={{ m: 1 }} checked={themeCheck === 'dark' ? true : false} onChange={toggleTheme} />}
                    />
                    </Box>
                </Paper>
            </Grid>
            

            <Grid sx={{mt:1}}>
            <Button fullWidth variant="contained" onClick={handleOpen} sx={{ background:'gold', color:'black', mt: 3, display: user?.user.role === "super" ? "block" : "none" }}>
                Add Fixture
            </Button>
            </Grid>
    </Grid>
    <Grid item xs={12} sm={4}>
        <Paper sx={{padding: 2}}>
        <img style={{width:'100%'}} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSniRMFZLCXc9MiqwcK-SqSxQQYMqstQ9VaaQ&s' />
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', mt:1}}>
            <Typography variant='subtitle2'>Venue</Typography>
            <Typography variant='subtitle2'>London Stadium</Typography>
        </Box>
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <Typography variant='subtitle2'>Capacity</Typography>
            <Typography variant='subtitle2'>60,000</Typography>
        </Box>
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <Typography variant='subtitle2'>Directions</Typography>
            <Typography variant="subtitle2" component="span">Click <Box component="a" href={link} target='_blank' display="inline">here</Box></Typography>
        </Box>
        </Paper>

    </Grid>
</Grid>
<GameModal open={open} handleClose={handleClose} />

</Box>
                )}
                       
        </>
    );
};

export default MainPage;
