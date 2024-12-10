import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Autocomplete, Box } from '@mui/material';
import { fetchAllManagers } from '../endpoints/ManagersRoutes';
import { addNewGame } from '../endpoints/GamesRoutes';
import { Toaster, toast } from 'sonner';
import { getFixtures } from '../endpoints/Fixures';
import { fetchAllGames } from '../endpoints/GamesRoutes';

const AddGame = ({ open, onClose }) => {
  const [gameData, setGameData] = useState({
    name: '',
    date: '',
    manager_id: ''
  });
  const [managers, setManagers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchEvents = async () => {
    const response = await fetchAllGames();
    setEvents(response);
  };

  const fetchManagers = async () => {
    const response = await fetchAllManagers();
    setManagers(response.map(manager => ({
      manager_id: manager.id,
      name: manager.name,
    })));
  };

  const fetchGames = async () => {
    const response = await getFixtures();
    const homeGames = response.filter(team => team.home_team === "West Ham United");
    setFixtures(homeGames);
  };

  useEffect(() => {
    fetchManagers();
    fetchGames();
    fetchEvents();
  }, []);

  useEffect(() => {
    // Update the game date whenever a game is selected from the fixtures
    const fixture = fixtures.find(fixture => fixture.name === gameData.name);
    if (fixture) {
      setGameData(prev => ({ ...prev, date: fixture.date }));
    }
  }, [gameData.name, fixtures]);

  const handleChange = (e) => {
    setGameData({ ...gameData, [e.target.name]: e.target.value });
  };

  const handleManagerChange = (event, value) => {
    setGameData({ ...gameData, manager_id: value?.manager_id || '' });
  };

  const handleNameChange = (event, value) => {
    setGameData({ ...gameData, name: value?.name || '' });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!gameData.name) newErrors.name = "Game is required";
    if (!gameData.manager_id) newErrors.manager_id = 'Manager is required';
    if (!gameData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setGameData({
      name: '',
      date: '',
      manager_id: ''
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }
    try {
      const response = await addNewGame(gameData);
      toast.message(`New Game Added: ${gameData.name}`, {
        description: `Today at ${new Date().toLocaleTimeString('en-GB').slice(0, 5)}`,
        duration: 5000
      });
      onClose();
      resetForm();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Add New Game</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Toaster />

            {/* Manager Selection */}
            <Grid item xs={12}>
              <Autocomplete
                options={managers}
                getOptionLabel={(option) => option.name.split('-')[0]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Managers"
                    error={!!errors.manager_id}
                    helperText={errors.manager_id}
                  />
                )}
                value={managers.find(manager => manager.manager_id === gameData.manager_id) || null}
                onChange={handleManagerChange}
              />
            </Grid>

            {/* Game Selection */}
            <Grid item xs={12}>
              <Autocomplete
                options={fixtures}
                getOptionLabel={(option) => option.name.split('-')[0]} 
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Game"
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                )}
                value={fixtures.find(fixture => fixture.name === gameData.name) || null}
                onChange={handleNameChange}
                getOptionDisabled={(option) => events.some(event => event.name === option.name)} 
              />
            </Grid>

            {/* Date 
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                value={gameData.date}
                onChange={handleChange}
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                autoFocus
                error={!!errors.date}
                helperText={errors.date}
                disabled
              />
            </Grid>
            */}

          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: 'gold', border: '1px solid gold' }}>
          Cancel
        </Button>
        <Button sx={{ background: 'gold', color: 'black' }} onClick={handleSubmit} color="primary">
          Add Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGame;
