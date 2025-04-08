import React, { useEffect, useState } from "react";
import { Box, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Grid, Divider, Button, Paper } from "@mui/material";
import { getFixtures } from "../endpoints/Fixures";
import { premierLeagueTeams } from "../utils/Teams";
import FixtureCountDown from "../utils/FixtureCountDown";

const FixturesPage = ({ setShowFixture }) => {
  const [fixtures, setFixtures] = useState([]);
  const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    const fetchAllFixtures = async () => {
      const response = await getFixtures();
      const sortedFixtures = response.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort fixtures by date
      setFixtures(sortedFixtures);
      
      // Find the next upcoming fixture
      const now = new Date();
      const upcoming = sortedFixtures.find(fixture => new Date(fixture.date) > now);
      setNextGame(upcoming || null);
    };

    fetchAllFixtures();
  }, []);

  const retrieveImage = (teamName) => {
    const team = premierLeagueTeams.find(team => team.name === teamName);
    return team ? team.badge : "";
  };

  // Group fixtures by year & month
  const groupFixtures = (fixtures) => {
    return fixtures.reduce((acc, fixture) => {
      const date = new Date(fixture.date);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "long" });

      const key = `${year} - ${month}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(fixture);
      return acc;
    }, {});
  };

  const groupedFixtures = groupFixtures(fixtures);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: '800' }}></Typography>
        <Button onClick={() => setShowFixture(false)} variant="contained" sx={{ background: 'gold', color: 'black' }}>
          Back
        </Button>
      </Box>

      {/* Next Match Section */}
      {nextGame && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '12px', textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, textAlign:'center' }}>Upcoming Fixture</Typography>
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          
          {/* Home Team */}
          <Grid item xs={12} md={4}>
            <Avatar src={retrieveImage(nextGame.home_team)} sx={{ width: 64, height: 64, mx: 'auto', mb:1 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>{nextGame.home_team}</Typography>
          </Grid>
      
          {/* Match Details */}
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">{nextGame.competition}</Typography>
            <Typography variant="body2" color="text.secondary">{nextGame.stadium}</Typography>
            <Typography variant="body2" color="text.secondary">{new Date(nextGame.date).toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary"> <FixtureCountDown date={nextGame.date} /></Typography>
          </Grid>
      
          {/* Away Team */}
          <Grid item xs={12} md={4}>
            <Avatar src={retrieveImage(nextGame.away_team)} sx={{ width: 64, height: 64, mx: 'auto', mb:1 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>{nextGame.away_team}</Typography>
          </Grid>
      
        </Grid>
      </Paper>
      
      )}

      {/* Grouped Fixtures */}
      <Box sx={{ p: 2 }}>
        {Object.entries(groupedFixtures)
        .reverse()
        .map(([monthYear, games]) => (
          <Box key={monthYear} sx={{ mb: 4 }}>
            <Box sx={{display:'flex', gap:'10px'}}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>{monthYear.split('-')[1]}</Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>{monthYear.split('-')[0]}</Typography>
            </Box>
            <Grid container spacing={2}>
              {games.map((fixture) => (
                <Grid item xs={12} sm={6} md={3} key={fixture.id}>
                  <ListItem sx={{ borderRadius: "10px", p: 2, border: new Date(fixture.date) >= new Date() ? "1px solid #ddd" : '1px solid #90EE90' }}>
                    <ListItemAvatar>
                      <Avatar src={retrieveImage(fixture.home_team)} sx={{ borderRadius: "10px", objectFit: "contain" }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${fixture.home_team_abb} vs ${fixture.away_team_abb}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">{fixture.stadium}</Typography>
                          <Typography variant="body2" color="text.secondary">{new Date(fixture.date).toLocaleString()}</Typography>
                          <Typography variant="body2" color="text.secondary">{fixture.competition}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ mt: 3 }} />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default FixturesPage;
