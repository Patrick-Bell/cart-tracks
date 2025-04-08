import { sortData, calculateActualCartTotal, calculateWorkerValue, formatCurrency, formatTotal, onWatchlist } from "../utils/AnalyticsFunctions";
import { Box, TableContainer, Paper, Table, TableRow, TableCell, IconButton, TableBody, TableHead } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


const WorkerTable = ({ sortConfig, setSortConfig, workerData, setFilteredWorkers, filteredWorkers }) => {

    const { mode } = useThemeContext()

    return (

        <Box sx={{ mt: 3,}}>
            <TableContainer sx={{maxHeight:570, mb:2, borderRadius:'10px' }} component={Paper} elevation={0}>
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


    )
}


export default WorkerTable