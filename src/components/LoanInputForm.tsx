import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { LoanDetails } from '../types/loan';
import { formatIndianNumber, parseIndianNumber } from '../utils/formatters';

interface LoanInputFormProps {
  onSubmit: (details: LoanDetails) => void;
}

const LoanInputForm: React.FC<LoanInputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    principal: '',
    interestRate: '',
    loanTerm: '',
  });

  const [displayPrincipal, setDisplayPrincipal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      principal: Number(parseIndianNumber(formData.principal)),
      interestRate: Number(formData.interestRate),
      loanTerm: Number(formData.loanTerm),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'principal') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue) {
        const formattedValue = formatIndianNumber(numericValue);
        setDisplayPrincipal(formattedValue);
        setFormData(prev => ({
          ...prev,
          [name]: numericValue,
        }));
      } else {
        setDisplayPrincipal('');
        setFormData(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Loan Details
            <Tooltip title="Enter your loan details to calculate EMI and generate amortization schedule">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below to get started with your loan calculation
          </Typography>
        </Box>

        <TextField
          required
          fullWidth
          label="Loan Amount"
          name="principal"
          value={displayPrincipal}
          onChange={handleChange}
          variant="outlined"
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

        <TextField
          required
          fullWidth
          label="Interest Rate"
          name="interestRate"
          type="number"
          value={formData.interestRate}
          onChange={handleChange}
          variant="outlined"
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

        <TextField
          required
          fullWidth
          label="Loan Term"
          name="loanTerm"
          type="number"
          value={formData.loanTerm}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">Years</InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            backgroundImage: 'linear-gradient(135deg, #2E5CFF 0%, #7B3FE4 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(46, 92, 255, 0.3)',
            },
          }}
        >
          Calculate EMI
        </Button>
      </Stack>
    </Box>
  );
};

export default LoanInputForm; 