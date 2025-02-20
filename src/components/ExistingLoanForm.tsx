import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { LoanDetails } from '../types/loan';
import { formatIndianNumber, parseIndianNumber } from '../utils/formatters';

interface ExistingLoanFormProps {
  onSubmit: (details: LoanDetails) => void;
}

const ExistingLoanForm: React.FC<ExistingLoanFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    principal: '',
    interestRate: '',
    loanTerm: '',
    startDate: dayjs(),
    currentBalance: '',
    monthlyEMI: '',
  });

  const [displayValues, setDisplayValues] = useState({
    principal: '',
    currentBalance: '',
    monthlyEMI: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateMonths = dayjs().diff(formData.startDate, 'month');
    const remainingTermYears = Number(formData.loanTerm) - (startDateMonths / 12);

    onSubmit({
      principal: Number(parseIndianNumber(formData.currentBalance)),
      interestRate: Number(formData.interestRate),
      loanTerm: remainingTermYears,
      startDate: formData.startDate.toDate(),
      originalPrincipal: Number(parseIndianNumber(formData.principal)),
      originalTerm: Number(formData.loanTerm),
      monthlyEMI: Number(parseIndianNumber(formData.monthlyEMI)),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['principal', 'currentBalance', 'monthlyEMI'].includes(name)) {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue) {
        const formattedValue = formatIndianNumber(numericValue);
        setDisplayValues(prev => ({
          ...prev,
          [name]: formattedValue,
        }));
        setFormData(prev => ({
          ...prev,
          [name]: numericValue,
        }));
      } else {
        setDisplayValues(prev => ({
          ...prev,
          [name]: '',
        }));
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

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        startDate: date,
      }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Enter Existing Loan Details
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          required
          fullWidth
          label="Original Loan Amount"
          name="principal"
          value={displayValues.principal}
          onChange={handleChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
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
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />

        <TextField
          required
          fullWidth
          label="Original Loan Term"
          name="loanTerm"
          type="number"
          value={formData.loanTerm}
          onChange={handleChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">Years</InputAdornment>,
          }}
        />

        <DatePicker
          label="Loan Start Date"
          value={formData.startDate}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true,
            },
          }}
        />

        <TextField
          required
          fullWidth
          label="Current Outstanding Balance"
          name="currentBalance"
          value={displayValues.currentBalance}
          onChange={handleChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />

        <TextField
          required
          fullWidth
          label="Current Monthly EMI"
          name="monthlyEMI"
          value={displayValues.monthlyEMI}
          onChange={handleChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Calculate Loan Details
        </Button>
      </Box>
    </Box>
  );
};

export default ExistingLoanForm; 