import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Typography, 
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Expenses = ({ expenses, setExpenses }) => {
    const navigate = useNavigate();
    const [newExpense, setNewExpense] = useState({
        category: '',
        amount: '',
        description: '',
        type: 'variable'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newExpense.category || !newExpense.amount) {
            alert('Category and Amount are required');
            return;
        }
        const expenseToAdd = {
            ...newExpense,
            amount: parseFloat(newExpense.amount || 0),
            id: Date.now()
        };
        setExpenses([...expenses, expenseToAdd]);
        setNewExpense({ category: '', amount: '', description: '', type: 'variable' });
    };

    const handleDelete = (id) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Expenses
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Category"
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({
                                    ...newExpense,
                                    category: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({
                                    ...newExpense,
                                    amount: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="type-select">Type</InputLabel>
                                <Select
                                    native
                                    value={newExpense.type}
                                    onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
                                    label="Type"
                                    inputProps={{
                                        name: 'type',
                                        id: 'type-select',
                                    }}
                                >
                                    <option value="fixed">Fixed</option>
                                    <option value="variable">Variable</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={2}
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({
                                    ...newExpense,
                                    description: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                sx={{ mr: 2 }}
                            >
                                Add Expense
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/dashboard')}
                            >
                                Back to Dashboard
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <List sx={{ mt: 4 }}>
                    {expenses.map((expense) => (
                        <ListItem
                            key={expense.id}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(expense.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={`${expense.category}: $${expense.amount}`}
                                secondary={`${expense.type} - ${expense.description}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Expenses;