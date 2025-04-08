import { Box, Paper, Grid, Typography, LinearProgress, CircularProgress, Divider } from "@mui/material";
import { fetchAllWorkers } from "../endpoints/WorkersRoutes";
import { useEffect, useState } from "react";
import { fetchAllGames } from "../endpoints/GamesRoutes";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { formatMargin, processGameData, formatTotal, calculateBestMonth, getNumberOfGamesInMonth, totalNumberOfProgrammes } from "../utils/AnalyticsFunctions";
import WorkerTable from "./WorkerTable";
import Chart from "./Chart";

//

const Analytics = () => {
    const [workerData, setWorkerData] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        name: 'desc',
        shifts: 'desc',
        workerValue: 'desc',
        totalValue: 'desc',
        margin: 'desc',
    });
    const [gameData, setGameData] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('November 2024')
    const [sold, setSold] = useState(0)

    const [monthlyData, setMonthlyData] = useState({
        workerTotal: [],
        actualTotal: [],
        months: [],
        margin: [],
        progress: []
      });
      const [totals, setTotals] = useState({
        workerTotal: '',
        actualTotal: '',
        margin: '',
        progress: ''
      })
     

      const [pageLoading, setPageLoading] = useState(true)
      const [numberOfGames, setNumberOfGames] = useState(0); // To store the number of games


        const fetchGames = async () => {
          const response = await fetchAllGames()
          setGameData(response)
          const games = await getNumberOfGamesInMonth(selectedMonth);
          setNumberOfGames(games); // Store the result in state
          setPageLoading(false)
        }
        
        useEffect(() => {
          fetchGames()
          fetchWorkers()
        }, [])
    

  
  // Call `getComparisonData` when gameData changes
  useEffect(() => {
    if (gameData.length > 0) {
      processGameData(gameData, setMonthlyData, totals, setTotals)
      const sells = totalNumberOfProgrammes(gameData)
      setSold(sells)
    }
  }, [gameData]);
    
  const { bestMonth, highestMargin, highestProgress } = calculateBestMonth(monthlyData)

    
      const filteredData = selectedMonth === "All"
      ? monthlyData  // Show all data if "All" is selected
      : {
          months: monthlyData.months.filter(month => month === selectedMonth),
          workerTotal: monthlyData.workerTotal.filter((_, index) => monthlyData.months[index] === selectedMonth),
          actualTotal: monthlyData.actualTotal.filter((_, index) => monthlyData.months[index] === selectedMonth),
      };

    const fetchWorkers = async () => {
        try {
            const response = await fetchAllWorkers();
            setWorkerData(response);
            setFilteredWorkers(response);
        } catch (e) {
            console.error("Error fetching workers:", e);
        }
    };
  

    useEffect(() => {
      const fetchGames = async () => {
        const games = await getNumberOfGamesInMonth(selectedMonth); // Fetch games count
        setNumberOfGames(games); // Update state with the number of games
      };
  
      fetchGames(); // Call the async function when the component mounts or selectedMonth changes
    }, [selectedMonth]); // This effect will run when selectedMonth changes

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
{gameData.some(game => game.complete_status) ? (
    <>
<Grid container spacing={2}>
  {/* Chart */}
  <Chart gameData={gameData} filteredData={filteredData} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

  {/* Right side - Total Earnings + Additional Info - 2x2 Grid */}
  <Grid item xs={12} sm={6}>
    <Grid container spacing={2}>

     <Grid item xs={12}>
      <Paper elevation={0} sx={{p:2, borderRadius:'10px'}}>
      <Typography sx={{ fontWeight: 700, mt: 1, mb:1 }}>Analytics</Typography>
      <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', p:1}}>
        <Typography variant="subtitle2">Total Workers</Typography>
        <Typography variant="subtitle2" sx={{fontWeight:800}}>{workerData.length}</Typography>
      </Box>
      <Divider />
      <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', p:1}}>
        <Typography variant="subtitle2">Total Events</Typography>
        <Typography variant="subtitle2" sx={{fontWeight:800}}>{gameData.length}</Typography>
      </Box>
      <Divider />
      <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', p:1}}>
        <Typography variant="subtitle2">Total Programmes Sold</Typography>
        <Typography variant="subtitle2" sx={{fontWeight:800}}>{(sold).toLocaleString()} <span style={{color:'grey', fontSize:'12px'}}>({(sold / gameData.length).toFixed(2)}) p/game</span></Typography>
      </Box>
      <Divider />
      </Paper>
     </Grid>



     <Grid item xs={12} sm={6}>
        <Paper elevation={0} sx={{ p: 2, borderRadius:'10px' }}>
          <CalendarMonthIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>{selectedMonth}</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            Margin:
          <span style={{marginLeft:'5px'}}>{formatTotal(filteredData.actualTotal, filteredData.workerTotal)}</span>
          </Typography>
          <Divider />
          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <Typography variant="subtitle2" color="grey">Worker Value</Typography>
            <Typography variant="subtitle2" color="grey">£{(filteredData.workerTotal).toLocaleString()}</Typography>
          </Box>
          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <Typography variant="subtitle2" color="grey">Expected Value</Typography>
            <Typography variant="subtitle2" color="grey">£{(filteredData.actualTotal).toLocaleString()}</Typography>
          </Box>
          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <Typography variant="subtitle2" color="grey">Games in month</Typography>
            <Typography variant="subtitle2" color="grey">{numberOfGames}</Typography>
          </Box>
        </Paper>
      </Grid>


      {/* Box 4 - Additional Info 3 */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={0} sx={{ p: 2, borderRadius:'10px' }}>
          <CalendarMonthIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Best Month</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            {bestMonth} {formatMargin(highestMargin)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={highestProgress}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' }
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">{highestProgress}%</Typography>
        </Paper>
      </Grid>

    </Grid>
  </Grid>
</Grid>

        <WorkerTable setFilteredWorkers={setFilteredWorkers} filteredWorkers={filteredWorkers} sortConfig={sortConfig} setSortConfig={setSortConfig} workerData={workerData} />
        </>
        ) : (
            <>
            <Paper elevation={0} sx={{p:3, borderRadius:'10px'}}>
                <Typography>To view <span style={{fontWeight:'800'}}>Analytics</span>, you must submit at least one game.</Typography>
            </Paper>
            </>
        )}
        </>
    );
};

export default Analytics;
