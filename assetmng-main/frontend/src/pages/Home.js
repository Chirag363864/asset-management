import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Security, Assessment } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Investment Recommendations',
      description: 'Get personalized investment advice based on your risk profile and financial goals.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Portfolio Management',
      description: 'Track your investments securely with real-time updates and performance analytics.',
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Financial Analytics',
      description: 'Comprehensive reports and insights to help you make informed financial decisions.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Your Personal Finance Advisor
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Take control of your financial future with personalized investment recommendations,
            expense tracking, and portfolio management.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                border: '2px solid #FFA500',
                '&:hover': { 
                  backgroundColor: '#FFA500',
                  boxShadow: '0 12px 32px rgba(255, 165, 0, 0.5)',
                  transform: 'translateY(-3px)',
                  border: '2px solid #FF8C00'
                },
                px: 5,
                py: 1.8,
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                borderWidth: 2,
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': { 
                  borderColor: 'white',
                  borderWidth: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)'
                },
                px: 5,
                py: 1.8,
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose FinanceAdvisor?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to manage your finances in one place
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="md" textAlign="center">
          <Typography variant="h4" gutterBottom>
            Ready to Start Your Financial Journey?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of users who are already taking control of their finances
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ px: 4, py: 1.5 }}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;