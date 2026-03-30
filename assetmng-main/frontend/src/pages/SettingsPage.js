import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  Logout,
  Security,
  Email,
  Phone,
  Person
} from '@mui/icons-material';
import { userAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/ui.module.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [logoutDialog, setLogoutDialog] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    monthly_salary: '',
    monthly_expenses: '',
    risk_profile: '',
    time_frame: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getFinancialProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        monthly_salary: response.data.monthly_salary || '',
        monthly_expenses: response.data.monthly_expenses || '',
        risk_profile: response.data.risk_profile || 'moderate',
        time_frame: response.data.time_frame || 'medium'
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile({
        ...formData,
        monthly_salary: parseFloat(formData.monthly_salary) || 0,
        monthly_expenses: parseFloat(formData.monthly_expenses) || 0
      });

      setSuccess('Profile updated successfully!');
      setEditing(false);
      await fetchProfile();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      monthly_salary: profile?.monthly_salary || '',
      monthly_expenses: profile?.monthly_expenses || '',
      risk_profile: profile?.risk_profile || 'moderate',
      time_frame: profile?.time_frame || 'medium'
    });
    setEditing(false);
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement photo upload to backend
      console.log('Photo selected:', file);
      setSuccess('Photo upload feature coming soon!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (loading) {
    return (
      <Box className={styles.pageContainer} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.pageContainer}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box className={`${styles.flexBetween} ${styles.fadeIn} ${styles.mb6}`}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Account Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your profile and preferences
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={() => setLogoutDialog(true)}
            sx={{
              borderRadius: '12px',
              px: 3
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Picture Section */}
          <Grid item xs={12} md={4}>
            <Card className={`${styles.statCard} ${styles.slideInUp}`}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '3rem',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    }}
                  >
                    {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <input
                    accept="image/*"
                    id="photo-upload"
                    type="file"
                    hidden
                    onChange={handlePhotoUpload}
                  />
                  <label htmlFor="photo-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: 'var(--primary)',
                        color: 'white',
                        '&:hover': {
                          background: 'var(--primary-dark)'
                        }
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {formData.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {formData.email || 'No email set'}
                </Typography>

                <Box className={styles.surface} sx={{ p: 2, mt: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Member Since
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Information Section */}
          <Grid item xs={12} md={8}>
            <Card className={`${styles.statCard} ${styles.slideInUp} ${styles.delay100}`}>
              <CardContent sx={{ p: 4 }}>
                <Box className={styles.flexBetween} sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Personal Information
                  </Typography>
                  {!editing && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setEditing(true)}
                      sx={{ borderRadius: '8px' }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      placeholder="+91 98765 43210"
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Risk Profile</InputLabel>
                      <Select
                        value={formData.risk_profile}
                        onChange={(e) => setFormData({ ...formData, risk_profile: e.target.value })}
                        label="Risk Profile"
                      >
                        <MenuItem value="conservative">Conservative</MenuItem>
                        <MenuItem value="moderate">Moderate</MenuItem>
                        <MenuItem value="aggressive">Aggressive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Financial Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Monthly Salary"
                      type="number"
                      value={formData.monthly_salary}
                      onChange={(e) => setFormData({ ...formData, monthly_salary: e.target.value })}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Monthly Expenses"
                      type="number"
                      value={formData.monthly_expenses}
                      onChange={(e) => setFormData({ ...formData, monthly_expenses: e.target.value })}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Investment Time Frame</InputLabel>
                      <Select
                        value={formData.time_frame}
                        onChange={(e) => setFormData({ ...formData, time_frame: e.target.value })}
                        label="Investment Time Frame"
                      >
                        <MenuItem value="short">Short Term (&lt; 1 year)</MenuItem>
                        <MenuItem value="medium">Medium Term (1-5 years)</MenuItem>
                        <MenuItem value="long">Long Term (5+ years)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.monthly_salary && formData.monthly_expenses && (
                    <Grid item xs={12}>
                      <Box className={styles.surface} sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Monthly Savings Potential
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                          ₹{(parseFloat(formData.monthly_salary) - parseFloat(formData.monthly_expenses)).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {editing && (
                  <Box className={styles.flexRow} sx={{ gap: 2, mt: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      sx={{
                        flex: 1,
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{
                        flex: 1,
                        py: 1.5,
                        borderRadius: '12px'
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Logout Confirmation Dialog */}
        <Dialog 
          open={logoutDialog} 
          onClose={() => setLogoutDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: 'var(--surface)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Confirm Logout
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to logout from your account?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button 
              onClick={() => setLogoutDialog(false)}
              sx={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleLogout}
              sx={{ borderRadius: '8px' }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SettingsPage;
