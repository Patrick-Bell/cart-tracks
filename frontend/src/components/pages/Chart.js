import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem } from "@mui/material"
import { BarChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import { getComparisonData, processGameData,  } from "../utils/AnalyticsFunctions";


const Chart = ({ gameData, filteredData, selectedMonth, setSelectedMonth }) => {
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

      const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
      }; 

      useEffect(() => {
        if (gameData.length > 0) {
          processGameData(gameData, setMonthlyData, totals, setTotals)
        }
      }, [gameData]);


    return (

        <>

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
            {monthlyData.months
                .sort((a, b) => new Date(a) - new Date(b)) // Sort the months
                .map((month) => (
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
        
        </>
    )
}

export default Chart