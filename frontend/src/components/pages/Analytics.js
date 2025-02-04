import { Box,Table,TableRow,TableBody,TableCell,TableHead,TableContainer,Paper,IconButton,Grid,Typography,Select,MenuItem,FormControl,LinearProgress,CircularProgress } from "@mui/material";
import { fetchAllWorkers } from "../endpoints/WorkersRoutes";
import { useEffect, useState } from "react";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { fetchAllGames } from "../endpoints/GamesRoutes";
import { BarChart, mangoFusionPaletteLight } from "@mui/x-charts";
import TrendingUp from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import { formatMargin, formatCurrency, formatMonth, getMonthData, calculateWorkerTotal, calculateActualCartTotal, calculateCartValue, calculateWorkerValue, calculateMonthMetrics, onWatchlist, getComparisonData, processGameData, sortData, formatTotal, calculateBestMonth } from "../utils/AnalyticsFunctions";
import { useThemeContext } from '../../context/ThemeContext'

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
      const [lastMonthData, setLastMonthData] = useState({
        workerTotal:'',
        actualTotal: '',
        margin: '',
        progress:''
      })
      const [thisMonthData, setThisMonthData] = useState({
        workerTotal:'',
        actualTotal: '',
        margin: '',
        progress:''
      })

      const [pageLoading, setPageLoading] = useState(true)
      const { mode } = useThemeContext()

        const fetchGames = async () => {
            const response = await fetchAllGames()
            setGameData(response)
            console.log(response, 'gamedata')
        }

        useEffect(() => {
            fetchGames()
            fetchWorkers()
            setPageLoading(false)
        }, [])
      

      // Helper function to calculate cart value
      const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
      }; 
    
  
  // Call `getComparisonData` when gameData changes
  useEffect(() => {
    if (gameData.length > 0) {
      getComparisonData(setLastMonthData, setThisMonthData, gameData);
      processGameData(gameData, setMonthlyData, totals, setTotals)
      console.log(monthlyData, 'test aray')
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


      console.log('monthlydata', monthlyData)

    const fetchWorkers = async () => {
        try {
            const response = await fetchAllWorkers();
            setWorkerData(response);
            setFilteredWorkers(response);
        } catch (e) {
            console.error("Error fetching workers:", e);
        }
    };

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
  <Grid item xs={12} sm={6}>
    <Paper elevation={3} sx={{ maxWidth: "100%", overflowX: "auto", padding: 2 }}>
      <Box sx={{ textAlign: "center", marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" gutterBottom>
          {selectedMonth === "All"
            ? "Monthly Performance Overview"
            : `Performance for ${selectedMonth}`}
        </Typography>
        <FormControl sx={{ minWidth: '100px' }}>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            {monthlyData.months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <BarChart
        xAxis={[{ scaleType: "band", data: filteredData.months }]} // x-axis: months
        series={[
          {
            data: filteredData.workerTotal,
            label: "Worker Total (£)",
            color: "gold",
            labels: filteredData.workerTotal.map((value) =>
              value ? `£${value.toFixed(2)}` : ""
            ),
          },
          {
            data: filteredData.actualTotal,
            label: "Actual Total (£)",
            color: "red",
            labels: filteredData.actualTotal.map((value) =>
              value ? `£${value.toFixed(2)}` : ""
            ),
          },
        ]}
        width={600}
        height={300}
        sx={{
          "& .MuiCharts-label": { fontSize: "0.8rem", fontWeight: 500 },
        }}
      />
    </Paper>
  </Grid>

  {/* Right side - Total Earnings + Additional Info - 2x2 Grid */}
  <Grid item xs={12} sm={6}>
    <Grid container spacing={2}>

      {/* Box 1 - Total Earnings */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ p: 2 }}>
          <CurrencyPoundIcon sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Total Earnings</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            £{(totals.workerTotal).toLocaleString()} of £{(totals.actualTotal).toLocaleString()} {formatMargin(totals.margin)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={totals.progress}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' }
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">{totals.progress}%</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper sx={{ p: 2 }}>
          <TrendingUp sx={{ p: 2, background: 'lightyellow', color: 'gold', borderRadius: '50%', fontSize:'50px' }} />
          <Typography sx={{ fontWeight: 700, mt: 1 }}>Average Earnings</Typography>
          <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
            £{(totals.workerTotal / monthlyData.months.length).toLocaleString()} of £{(totals.actualTotal / monthlyData.months.length).toLocaleString()} {formatMargin(totals.margin / monthlyData.months.length)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={totals.progress / monthlyData.months.length}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: '10px',
              background: 'lightyellow',
              '& .MuiLinearProgress-bar': { backgroundColor: 'gold' }
            }}
          />
          <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">{(totals.progress / monthlyData.months.length).toFixed(2)}%</Typography>
        </Paper>
      </Grid>


{gameData.some(game => game.complete_status.length > 2  && (
      <Grid item xs={12} sm={6}>
  <Paper sx={{ p: 2 }}>
    <TrendingUp 
      sx={{ 
        p: 2, 
        background: 'lightyellow', 
        color: 'gold', 
        borderRadius: '50%', fontSize:'50px'
      }} 
    />
    <Typography sx={{ fontWeight: 700, mt: 1 }}>Growth From Last Month</Typography>
    
    {/* Worker Total Growth Display */}
    <Typography variant="subtitle2" sx={{ color: 'grey', display: 'flex' }}>
      From £{lastMonthData.workerTotal.toLocaleString()} to £{thisMonthData.workerTotal.toLocaleString()} 
      {formatMargin(((thisMonthData.workerTotal - lastMonthData.workerTotal) / lastMonthData.workerTotal) * 100)}
    </Typography>
    
    {/* Linear Progress Bar */}
    <LinearProgress
      variant="determinate"
      value={((thisMonthData.workerTotal - lastMonthData.workerTotal )/ lastMonthData.workerTotal * 100).toFixed(2)} 
      sx={{
        mt: 2,
        height: 10,
        borderRadius: '10px',
        background: 'lightyellow',
        '& .MuiLinearProgress-bar': { backgroundColor: 'gold' }
      }}
    />
    
    {/* Margin Growth Display */}
    <Typography sx={{ color: 'grey', textAlign: 'right', mt: 1 }} variant="subtitle2">
    {((thisMonthData.workerTotal - lastMonthData.workerTotal )/ lastMonthData.workerTotal * 100).toFixed(2)}  %
    </Typography>
  </Paper>
</Grid>
))}


      {/* Box 4 - Additional Info 3 */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ p: 2 }}>
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

        <Box sx={{ mt: 3}}>
            <TableContainer sx={{maxHeight:570, mb:2, }} component={Paper}>
                <Table stickyHeader sx={{ border: 'none'}}>
                    <TableHead sx={{bgcolor: mode === 'dark' ? '#2D2D2D' : '#f5f5f5'}}>
                        <TableRow stickyHeader>
                            <TableCell sx={{ fontWeight: 800 }}>Worker</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>
                                <Box style={{ display: 'flex', alignItems: 'center' }}>
                                    Shifts
                                    <IconButton
                                        sx={{
                                            transform: sortConfig.shifts === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        onClick={() => sortData('shifts', sortConfig, setSortConfig, workerData, setFilteredWorkers)}
                                    >
                                        <ArrowCircleDownIcon />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>
                                <Box style={{ display: 'flex', alignItems: 'center' }}>
                                    Worker Value
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>
                                <Box style={{ display: 'flex', alignItems: 'center' }}>
                                    Actual Value
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>
                                <Box style={{ display: 'flex', alignItems: 'center' }}>
                                    Margin (£)
                                    <IconButton
                                        sx={{
                                            transform: sortConfig.margin === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        onClick={() => sortData('margin', sortConfig, setSortConfig, workerData, setFilteredWorkers)}
                                    >
                                        <ArrowCircleDownIcon />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredWorkers.map((worker) => {
                            const totalValue = calculateActualCartTotal(worker.carts || []);
                            const workerValue = calculateWorkerValue(worker.carts || []);
                            return (
                                <TableRow key={worker.id}>
                                    <TableCell sx={{ border: 'none', color: onWatchlist(worker) }}>
                                        {worker.name} {worker.last_name || ""}
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }}>{worker.carts?.length || 0}</TableCell>
                                    <TableCell sx={{ border: 'none' }}>{formatCurrency(workerValue)}</TableCell>
                                    <TableCell sx={{ border: 'none' }}>{formatCurrency(totalValue)}</TableCell>
                                    <TableCell sx={{ border: 'none' }}>{formatTotal(totalValue, workerValue)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </>
        ) : (
            <>
            <Paper elevation={3} sx={{p:3}}>
                <Typography>To view <span style={{fontWeight:'800'}}>Analytics</span>, you must submit at least one game.</Typography>
            </Paper>
            </>
        )}
        </>
    );
};

export default Analytics;
