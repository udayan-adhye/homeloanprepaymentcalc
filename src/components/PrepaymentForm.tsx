import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { LumpSumPayment } from '../types/loan';

interface PrepaymentFormProps {
  onLumpSumAdd: (payment: LumpSumPayment) => void;
  onEmiIncreaseChange: (percentage: number) => void;
  onAnnualPrepaymentChange: (amount: number) => void;
}

const PrepaymentForm: React.FC<PrepaymentFormProps> = ({
  onLumpSumAdd,
  onEmiIncreaseChange,
  onAnnualPrepaymentChange,
}) => {
  const [emiIncrease, setEmiIncrease] = useState('');
  const [lumpSumAmount, setLumpSumAmount] = useState('');
  const [lumpSumDate, setLumpSumDate] = useState<Dayjs>(dayjs());
  const [lumpSumPayments, setLumpSumPayments] = useState<LumpSumPayment[]>([]);
  const [annualPrepayment, setAnnualPrepayment] = useState('');

  const handleEmiIncreaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmiIncrease(value);
    onEmiIncreaseChange(Number(value));
  };

  const handleAnnualPrepaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnnualPrepayment(value);
    onAnnualPrepaymentChange(Number(value));
  };

  const handleLumpSumAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const payment = {
      amount: Number(lumpSumAmount),
      date: lumpSumDate.toDate(),
    };
    onLumpSumAdd(payment);
    setLumpSumPayments([...lumpSumPayments, payment]);
    setLumpSumAmount('');
    setLumpSumDate(dayjs());
  };

  const handleLumpSumDelete = (index: number) => {
    const newPayments = lumpSumPayments.filter((_, i) => i !== index);
    setLumpSumPayments(newPayments);
  };

  const formatDate = (date: Date): string => {
    return dayjs(date).format('MMMM YYYY');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Prepayment Options
      </Typography>

      <Stack spacing={4}>
        {/* Annual EMI Increase */}
        <Box>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Annual EMI Increase
            <Tooltip title="Increase your EMI by this percentage every year">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <TextField
            fullWidth
            label="EMI Increase Percentage"
            type="number"
            value={emiIncrease}
            onChange={handleEmiIncreaseChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* Annual Recurring Prepayment */}
        <Box>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Annual Recurring Prepayment
            <Tooltip title="This amount will be automatically prepaid every year until the loan ends">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <TextField
            fullWidth
            label="Annual Prepayment Amount"
            type="number"
            value={annualPrepayment}
            onChange={handleAnnualPrepaymentChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* Lump Sum Prepayment */}
        <Box component="form" onSubmit={handleLumpSumAdd}>
          <Typography 
            variant="subtitle1" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            One-time Lump Sum Prepayment
            <Tooltip title="Add one-time prepayments on specific dates">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              required
              label="Amount"
              type="number"
              value={lumpSumAmount}
              onChange={(e) => setLumpSumAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <DatePicker
              label="Payment Date"
              value={lumpSumDate}
              onChange={(date) => date && setLumpSumDate(date)}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  },
                },
              }}
            />
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                backgroundImage: 'linear-gradient(135deg, #2E5CFF 0%, #7B3FE4 100%)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(46, 92, 255, 0.3)',
                },
              }}
            >
              Add
            </Button>
          </Box>
        </Box>

        {/* Lump Sum Payments List */}
        {lumpSumPayments.length > 0 && (
          <List>
            {lumpSumPayments.map((payment, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleLumpSumDelete(index)}
                    sx={{ color: 'error.main' }}
                  >
                    ×
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`₹${payment.amount.toLocaleString()}`}
                  secondary={formatDate(payment.date)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Box>
  );
};

export default PrepaymentForm; 