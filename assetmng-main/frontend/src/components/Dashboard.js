import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Typography, 
    Button,
    Grid,
    Box,
    Card,
    CardContent
} from '@mui/material';
import { 
    AccountBalance, 
    TrendingUp, 
    Wallet, 
    ShowChart,
    Person,
    Receipt
} from '@mui/icons-material';
import styles from '../styles/ui.module.css';

const Dashboard = () => {
    const navigate = useNavigate();

    // Mock data for stats
    const stats = [
        { 
            label: 'Total Balance', 
            value: '$24,589', 
            change: '+12.5%', 
            trend: 'up',
            icon: <AccountBalance sx={{ fontSize: 32 }} />,
            color: '#0A84FF'
        },
        { 
            label: 'Investments', 
            value: '$18,420', 
            change: '+8.2%', 
            trend: 'up',
            icon: <TrendingUp sx={{ fontSize: 32 }} />,
            color: '#10B981'
        },
        { 
            label: 'Monthly Expenses', 
            value: '$3,245', 
            change: '-5.4%', 
            trend: 'down',
            icon: <Wallet sx={{ fontSize: 32 }} />,
            color: '#F59E0B'
        },
        { 
            label: 'Portfolio Growth', 
            value: '+15.8%', 
            change: 'This month', 
            trend: 'up',
            icon: <ShowChart sx={{ fontSize: 32 }} />,
            color: '#0A84FF'
        }
    ];

    const quickActions = [
        {
            title: 'Profile',
            description: 'Manage your account settings',
            icon: <Person sx={{ fontSize: 40 }} />,
            path: '/profile',
            color: '#0A84FF'
        },
        {
            title: 'Investments',
            description: 'View your investment portfolio',
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            path: '/investments',
            color: '#10B981'
        },
        {
            title: 'Expenses',
            description: 'Track and manage expenses',
            icon: <Receipt sx={{ fontSize: 40 }} />,
            path: '/expenses',
            color: '#F59E0B'
        }
    ];

    return (
        <Box className={styles.pageContainer}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box className={`${styles.fadeIn} ${styles.mb6}`}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 700,
                            mb: 1,
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        Financial Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome back! Here's your financial overview
                    </Typography>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} className={`${styles.fadeIn} ${styles.mb6}`}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} lg={3} key={stat.label}>
                            <Card 
                                className={`${styles.statCard} ${styles.slideInUp} ${styles[`delay${(index + 1) * 100}`]}`}
                                sx={{ 
                                    height: '100%',
                                    cursor: 'pointer'
                                }}
                            >
                                <CardContent>
                                    <Box className={styles.flexBetween} sx={{ mb: 2 }}>
                                        <Box 
                                            sx={{ 
                                                width: 56,
                                                height: 56,
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: stat.color
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Box 
                                            className={stat.trend === 'up' ? styles.statusSuccess : styles.statusWarning}
                                            sx={{ fontSize: '0.8rem' }}
                                        >
                                            {stat.change}
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Quick Actions */}
                <Box className={styles.mb6}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600,
                            mb: 3,
                            color: 'text.primary'
                        }}
                    >
                        Quick Actions
                    </Typography>
                    <Grid container spacing={3}>
                        {quickActions.map((action, index) => (
                            <Grid item xs={12} md={4} key={action.title}>
                                <Card 
                                    className={`${styles.glassCard} ${styles.slideInLeft} ${styles[`delay${(index + 1) * 100}`]}`}
                                    sx={{ 
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)'
                                        }
                                    }}
                                    onClick={() => navigate(action.path)}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box 
                                            sx={{ 
                                                width: 72,
                                                height: 72,
                                                borderRadius: '16px',
                                                background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: action.color,
                                                mb: 3,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {action.icon}
                                        </Box>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 600,
                                                mb: 1,
                                                color: 'text.primary'
                                            }}
                                        >
                                            {action.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {action.description}
                                        </Typography>
                                        <Box 
                                            sx={{ 
                                                mt: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: action.color,
                                                fontWeight: 600,
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            View Details
                                            <Box 
                                                component="span" 
                                                sx={{ 
                                                    ml: 1,
                                                    transition: 'transform 0.3s ease',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                →
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Bottom CTA */}
                <Box 
                    className={`${styles.surfaceElevated} ${styles.scaleIn} ${styles.delay300}`}
                    sx={{ 
                        p: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600,
                            mb: 2,
                            color: 'text.primary'
                        }}
                    >
                        Ready to grow your wealth?
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Explore investment opportunities and optimize your portfolio
                    </Typography>
                    <Button 
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/portfolio')}
                        sx={{ 
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '12px'
                        }}
                    >
                        View Portfolio
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Dashboard;