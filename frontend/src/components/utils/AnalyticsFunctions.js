import { Box, selectClasses, Typography } from "@mui/material"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { getFixtures } from "../endpoints/Fixures"

export const formatMargin = (margin) => {
    if (margin >= 0) {
        return (
            <Box sx={{display:'flex', marginLeft:'5px'}}>
            <ArrowDropUpIcon sx={{color:'green'}} />
            <Typography variant="subtitle2" sx={{color:'green'}}>+{Math.abs(margin).toFixed(2)}%</Typography>
            </Box>
        )
    } else {
        return (
            <Box sx={{display:'flex', marginLeft:'5px'}}>
            <ArrowDropDownIcon sx={{color:'red'}} />
            <Typography variant="subtitle2" sx={{color:'red'}}>-{Math.abs(margin).toFixed(2)}%</Typography>
            </Box>
        )
    }
}


export const onWatchlist = (worker) => {
    if (worker.watching) {
        return 'red'
    }
    return ''
};


export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
};


export const formatMonth = (date) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString('en-US', options);
  };




  // Helper function to calculate worker total
  export const calculateWorkerTotal = (cart) => cart.worker_total || 0;
  export const calculateCartValue = (cart) => (cart.final_quantity - cart.final_returns) * 4;
  export const calculateActualCartTotal = (carts) => carts?.reduce((total, cart) => total + calculateCartValue(cart), 0).toFixed(2) || "0.00";
  export const calculateWorkerValue = (carts) => carts?.reduce((sum, cart) => sum + (cart.worker_total || 0), 0).toFixed(2) || "0.00";

  export const getMonthData = (month, gameData) => {
    let workerTotal = 0;
    let actualTotal = 0;
    let uniqueCartNumbers = new Set();
  
    gameData.forEach((game) => {
      game.carts.forEach((cart) => {
        const cartMonth = formatMonth(cart.date);
        
        if (cartMonth === month && !uniqueCartNumbers.has(cart.cart_number)) {
          uniqueCartNumbers.add(cart.cart_number);
          workerTotal += calculateWorkerTotal(cart);
          actualTotal += calculateCartValue(cart);
        }
      });
    });
  
    return { workerTotal, actualTotal };
  };




  export  const calculateMonthMetrics = (workerTotal, actualTotal) => {
    const margin = ((workerTotal - actualTotal) / actualTotal * 100).toFixed(2);
    const progressPercentage = ((workerTotal / actualTotal) * 100).toFixed(2);
    return { margin, progress: progressPercentage };
  };



  export const getComparisonData = (setLastMonthData, setThisMonthData, gameData) => {
    // Get current date and last month
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));  // Subtract 1 month
    const currentMonth = new Date();  // Current month
    
    // Format months
    const lastMonthFormatted = formatMonth(lastMonth);
    const currentMonthFormatted = formatMonth(currentMonth);
  
    // Get data for both months
    const lastMonthTotals = getMonthData(lastMonthFormatted, gameData);
    const thisMonthTotals = getMonthData(currentMonthFormatted, gameData);
  
    // Calculate metrics (margin, progress) for both months
    const lastMonthMetrics = calculateMonthMetrics(lastMonthTotals.workerTotal, lastMonthTotals.actualTotal);
    const thisMonthMetrics = calculateMonthMetrics(thisMonthTotals.workerTotal, thisMonthTotals.actualTotal);
  
    // Update state with both months data
    setLastMonthData({
      workerTotal: lastMonthTotals.workerTotal,
      actualTotal: lastMonthTotals.actualTotal,
      margin: lastMonthMetrics.margin,
      progress: lastMonthMetrics.progress
    });
  
    setThisMonthData({
      workerTotal: thisMonthTotals.workerTotal,
      actualTotal: thisMonthTotals.actualTotal,
      margin: thisMonthMetrics.margin,
      progress: thisMonthMetrics.progress
    });
  };




  export const processGameData = (gameData, setMonthlyData, totals, setTotals) => {
    const monthsMap = {};

    // Iterate over the games and their carts to process the data
    gameData.forEach((game) => {
      game.carts.forEach((cart) => {
        const month = formatMonth(cart.date);

        // Ensure the cart number is unique in the processing
        if (!monthsMap[month]) {
          monthsMap[month] = { workerTotal: 0, actualTotal: 0, uniqueCartNumbers: new Set() };
        }

        // Check if cart number is unique for this month
        if (!monthsMap[month].uniqueCartNumbers.has(cart.cart_number)) {
          // Add the cart number to the set to ensure uniqueness
          monthsMap[month].uniqueCartNumbers.add(cart.cart_number);

          // Calculate and add the totals for this cart
          monthsMap[month].workerTotal += calculateWorkerTotal(cart);
          monthsMap[month].actualTotal += calculateCartValue(cart);
        }
      });
    });

    // Define the chronological order of months
    const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Sort the months based on the chronological order
    const months = Object.keys(monthsMap).sort((a, b) => {
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });

    const workerTotal = months.map((month) => monthsMap[month].workerTotal);
    const actualTotal = months.map((month) => monthsMap[month].actualTotal);

    const margin = months.map((month) => {
        const workerTotalMonth = monthsMap[month].workerTotal;
        const actualTotalMonth = monthsMap[month].actualTotal;
        
        // Calculate margin for each month
        const monthMargin = ((workerTotalMonth - actualTotalMonth) / actualTotalMonth) * 100;
        monthsMap[month].margin = monthMargin.toFixed(2); // Storing margin in the map

        return monthMargin; // Return the margin for each month
    });

    const progress = months.map((month) => {
        const workerTotalMonth = monthsMap[month].workerTotal;
        const actualTotalMonth = monthsMap[month].actualTotal;
        
        // Calculate progress for each month
        const monthProgress = ((workerTotalMonth / actualTotalMonth) * 100).toFixed(2); // Correct progress formula
        monthsMap[month].progress = monthProgress; // Store progress in monthsMap

        return monthProgress; // Return the margin for each month
    });

    // Prepare monthly data for the chart
    setMonthlyData({
        workerTotal,
        actualTotal,
        months,
        margin, // Include margin data
        progress,
    });

    // Calculate total values
    const workerFull = workerTotal.reduce((sum, value) => sum + value, 0);
    const actualFull = actualTotal.reduce((sum, value) => sum + value, 0);
    const diff = workerFull - actualFull;
    const marginPercentage = ((diff / actualFull) * 100).toFixed(2);
    const progressPercentage = ((workerFull / actualFull) * 100).toFixed(2);

    // Update total values
    setTotals({
        workerTotal: workerFull,
        actualTotal: actualFull,
        margin: marginPercentage,
        progress: progressPercentage,
    });
};




  export const sortData = (key, sortConfig, setSortConfig, workerData, setFilteredWorkers) => {
    const direction = sortConfig[key] === 'asc' ? 'desc' : 'asc';
    setSortConfig((prevConfig) => ({
        ...prevConfig,
        [key]: direction,
    }));

    const sortedData = [...workerData].sort((a, b) => {
        let aValue = a;
        let bValue = b;

        if (key === 'shifts') {
            aValue = a.carts?.length || 0;
            bValue = b.carts?.length || 0;
        } else if (key === 'margin') {
            aValue = calculateActualCartTotal(a.carts || []) - calculateWorkerValue(a.carts || []);
            bValue = calculateActualCartTotal(b.carts || []) - calculateWorkerValue(b.carts || []);
        } else if (key === 'name') {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    setFilteredWorkers(sortedData);
};



export const formatTotal = (totalValue, workerValue) => {
    const difference = (totalValue - workerValue).toFixed(2);
    const color = difference == 0 ? "grey" : (difference < 0 ? "green" : "red");
    return (
        <span style={{ color: color }}>
            £{Math.abs(difference).toFixed(2)}
        </span>
    );
};


export const calculateBestMonth = (monthlyData) => {
    // Ensure monthlyData is an object with arrays for the required fields
    const { margin, months, progress } = monthlyData;

    if (!Array.isArray(margin) || !Array.isArray(months) || !Array.isArray(progress) || margin.length !== months.length || margin.length !== progress.length) {
        console.error("Invalid data structure in monthlyData");
        return { bestMonth: "", highestMargin: 0, highestProgress: "" };
    }

    let bestMonth = "";
    let highestMargin = -Infinity; // Set to negative infinity so that any margin will be higher initially
    let highestProgress = "";

    // Loop through the margin array to calculate and compare margins
    margin.forEach((value, index) => {
        // Compare the margin value with the current highestMargin
        if (value > highestMargin) {
            highestMargin = value;
            bestMonth = months[index]; // Get the corresponding month from the months array
            highestProgress = progress[index]; // Ensure progress is displayed as a fixed number
        }
    });

    // Return the best month and its margin, along with the progress
    return { bestMonth, highestMargin: highestMargin.toFixed(2), highestProgress };
};



export const totalNumberOfProgrammes = (games) => {



  const carts = games.map(game => game.carts)

  const sold = carts.flat().reduce((sum, cart) => sum + cart.sold, 0)

  return sold
};


export const getNumberOfGamesInMonth = async (selectedMonth) => {
  try {
    const fixtures = await getFixtures()

    if (!Array.isArray(fixtures)) {
      console.error('Fixtures is not an array:', fixtures);
      return 0;  // Return 0 games if fixtures is invalid
    }

    const homeOnly = fixtures.filter(fixture => fixture.home_team_abb === 'WHU')
    
    const monthsInFixtures = homeOnly.map(fixture => {
      const monthIndex = new Date(fixture.date)
      const month = getMonthName(monthIndex)
      const year = new Date(fixture.date).getFullYear()
      return `${month} ${year}`
    })    

    const gamesInSelectedMonth = monthsInFixtures.filter(monthYear => monthYear === selectedMonth).length;

    return gamesInSelectedMonth


  } catch(e){
    console.log(e)
  }
}

export const getMonthName = (date) => {
  const options = { month: 'long' }; // 'long' gives the full month name, 'short' gives abbreviated name
  return date.toLocaleString('en-US', options);
};


