import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
} from '@mui/material';
import { LoanDetails, LumpSumPayment } from '../types/loan';
import { calculateLoanSummary } from '../utils/loanCalculator';

interface LoanSummaryCardProps {
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

const SummaryItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ 
  label, 
  value,
  highlight = false 
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        background: highlight 
          ? `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`
          : 'transparent',
        border: highlight ? 'none' : '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: highlight 
            ? '0 8px 24px rgba(46, 92, 255, 0.15)'
            : '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="h5"
          sx={{ 
            fontWeight: 600,
            ...(highlight ? {
              backgroundImage: 'linear-gradient(135deg, #2E5CFF 0%, #7B3FE4 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            } : {
              color: 'text.primary',
            }),
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const LoanSummaryCard: React.FC<LoanSummaryCardProps> = ({
  loanDetails,
  lumpSumPayments,
  emiIncreasePercentage,
  annualPrepayment,
}) => {
  const summary = calculateLoanSummary(loanDetails);

  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          mb: 3,
        }}
      >
        Loan Summary
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SummaryItem
            label="Monthly EMI"
            value={formatCurrency(summary.monthlyEMI)}
            highlight={true}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <SummaryItem
            label="Total Principal"
            value={formatCurrency(summary.totalPrincipal)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <SummaryItem
            label="Total Interest"
            value={formatCurrency(summary.totalInterest)}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <SummaryItem
            label="Total Amount"
            value={formatCurrency(summary.totalAmount)}
            highlight={true}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <SummaryItem
            label="Loan End Date"
            value={formatDate(summary.loanEndDate)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanSummaryCard; 