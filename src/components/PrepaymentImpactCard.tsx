import React from 'react';
import {
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { LoanDetails, LumpSumPayment } from '../types/loan';
import { calculatePrepaymentImpact } from '../utils/loanCalculator';

interface PrepaymentImpactCardProps {
  loanDetails: LoanDetails;
  lumpSumPayments: LumpSumPayment[];
  emiIncreasePercentage: number;
  annualPrepayment: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

const ImpactItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="h6" color="success.main">
      {value}
    </Typography>
  </Box>
);

const PrepaymentImpactCard: React.FC<PrepaymentImpactCardProps> = ({
  loanDetails,
  lumpSumPayments,
  emiIncreasePercentage,
  annualPrepayment,
}) => {
  const impact = calculatePrepaymentImpact(
    loanDetails, 
    lumpSumPayments, 
    emiIncreasePercentage,
    annualPrepayment
  );
  const monthsSaved = Math.floor(impact.timeSaved);
  const yearsSaved = Math.floor(monthsSaved / 12);
  const remainingMonths = monthsSaved % 12;

  const timeSavedText = yearsSaved > 0
    ? `${yearsSaved} year${yearsSaved > 1 ? 's' : ''} ${remainingMonths > 0 ? `and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
    : `${monthsSaved} month${monthsSaved > 1 ? 's' : ''}`;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Prepayment Impact
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ImpactItem
            label="Interest Saved"
            value={formatCurrency(impact.interestSaved)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ImpactItem
            label="Time Saved"
            value={timeSavedText}
          />
        </Grid>

        <Grid item xs={12}>
          <ImpactItem
            label="New Loan End Date"
            value={formatDate(impact.newLoanEndDate)}
          />
        </Grid>

        <Grid item xs={12}>
          <ImpactItem
            label="New Total Amount"
            value={formatCurrency(impact.newTotalAmount)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrepaymentImpactCard; 