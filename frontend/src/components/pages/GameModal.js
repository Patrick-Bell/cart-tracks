import { Dialog, DialogActions, DialogTitle, DialogContent, Box, Typography, Autocomplete, TextField, Select, MenuItem, Button, InputLabel } from "@mui/material";
import { premierLeagueTeams } from "../utils/Teams";
import { useState } from "react";
import { addFixture } from "../endpoints/Fixures";
import { Toaster, toast } from "sonner";

const GameModal = ({ open, handleClose }) => {
    const [competition, setCompetition] = useState('');
    const [homeTeam, setHomeTeam] = useState(null);
    const [awayTeam, setAwayTeam] = useState(null);
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});

    const handleCompetitionChange = (event) => {
        setCompetition(event.target.value);
    };

    const validateFields = () => {
        const newErrors = {};
        if (!homeTeam) newErrors.homeTeam = "Home team is required.";
        if (!awayTeam) newErrors.awayTeam = "Away team is required.";
        if (!date) newErrors.date = "Date and time are required.";
        if (!competition) newErrors.competition = "Competition is required.";
        if (homeTeam && awayTeam && homeTeam.name === awayTeam.name) {
            newErrors.awayTeam = "Home and away teams cannot be the same.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        const data = {
            home_team: homeTeam.name,
            away_team: awayTeam.name,
            stadium: homeTeam.stadium,
            capacity: homeTeam.capacity,
            home_icon: homeTeam.badge,
            away_icon: awayTeam ? awayTeam.badge : null,
            date: date,
            home_team_abb: homeTeam.abbreviation,
            away_team_abb: awayTeam.abbreviation,
            competition: competition,
        };
        console.log(data);

        try {
            const response = await addFixture(data);
            console.log(response);
            toast.success(`${response.home_team} v ${response.away_team} (${response.competition}) successfully added!`, {
                description: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
                duration:5000
            })
            handleClose()
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <DialogTitle>Add Fixture</DialogTitle>
            <Box fullWidth sx={{minWidth:'500px'}}>
            <DialogContent>

                <Autocomplete
                    value={homeTeam}
                    onChange={(event, newValue) => setHomeTeam(newValue)}
                    options={premierLeagueTeams}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Home Team"
                            error={!!errors.homeTeam}
                            helperText={errors.homeTeam}
                        />
                    )}
                    sx={{ mb: 2 }}
                />

                <Autocomplete
                    value={awayTeam}
                    onChange={(event, newValue) => setAwayTeam(newValue)}
                    options={premierLeagueTeams}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Away Team"
                            error={!!errors.awayTeam}
                            helperText={errors.awayTeam}
                        />
                    )}
                    sx={{ mb: 2 }}
                />

                <TextField
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="datetime-local"
                    fullWidth
                    error={!!errors.date}
                    helperText={errors.date}
                    sx={{ mb: 2 }}
                />

                <Autocomplete
                    value={competition}
                    onChange={(event, newValue) => setCompetition(newValue)}
                    options={[
                        "Premier League",
                        "FA Cup",
                        "League Cup",
                        "FA Cup Replay",
                        "League Cup Replay",
                        "UEFA Europa League",
                        "UEFA Conference League",
                        "UEFA Champions League",
                        "Community Shield",
                        "International Friendlies",
                    ]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Competition"
                            error={!!errors.competition}
                            helperText={errors.competition}
                        />
                    )}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                </DialogContent>
                <DialogActions>
                <Button variant="contained" fullWidth onClick={handleSubmit}>
                    Add Fixture
                </Button>
                </DialogActions>
            </Box>
        </Dialog>
        <Toaster/>
        </>
    );
};

export default GameModal;
