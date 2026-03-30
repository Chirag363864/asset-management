import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    TextField, 
    Button, 
    Container, 
    Paper, 
    Typography,
    Box,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const Profile = ({ setProfile: setAppProfile }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        monthly_salary: '',
        savings_goal: '',
        risk_tolerance: 'medium',
        investment_horizon: '5-10 years'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate the data before sending
        if (!profile.name || !profile.monthly_salary) {
            alert('Name and Monthly Salary are required');
            return;
        }

        const profileData = {
            ...profile,
            monthly_salary: parseFloat(profile.monthly_salary),
            savings_goal: profile.savings_goal ? parseFloat(profile.savings_goal) : 0,
        };

        setAppProfile(profileData);
        alert('Profile created successfully!');
        navigate('/dashboard');
    };

    const handleSliderChange = (event, newValue) => {
        const riskMap = {
            0: 'low',
            50: 'medium',
            100: 'high'
        };
        setProfile({ ...profile, risk_tolerance: riskMap[newValue] });
    };


    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Financial Profile
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Monthly Salary"
                        type="number"
                        value={profile.monthly_salary}
                        onChange={(e) => setProfile({...profile, monthly_salary: e.target.value})}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Savings Goal"
                        type="number"
                        value={profile.savings_goal}
                        onChange={(e) => setProfile({...profile, savings_goal: e.target.value})}
                        margin="normal"
                    />

                    <Typography gutterBottom sx={{ mt: 2 }}>Risk Tolerance</Typography>
                    <Slider
                        defaultValue={50}
                        step={50}
                        marks
                        min={0}
                        max={100}
                        onChange={handleSliderChange}
                        valueLabelFormat={(value) => ({0: 'Low', 50: 'Medium', 100: 'High'}[value])}
                        valueLabelDisplay="auto"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Investment Horizon</InputLabel>
                        <Select
                            value={profile.investment_horizon}
                            onChange={(e) => setProfile({ ...profile, investment_horizon: e.target.value })}
                            label="Investment Horizon"
                        >
                            <MenuItem value="<1 year">Less than 1 year</MenuItem>
                            <MenuItem value="1-3 years">1-3 years</MenuItem>
                            <MenuItem value="3-5 years">3-5 years</MenuItem>
                            <MenuItem value="5-10 years">5-10 years</MenuItem>
                            <MenuItem value=">10 years">More than 10 years</MenuItem>
                        </Select>
                    </FormControl>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Create Profile
                    </Button>
                    <Button 
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Go to Dashboard
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;