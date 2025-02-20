import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LoanDetails, LumpSumPayment } from '../types/loan';
import { calculateAmortizationSchedule } from '../utils/loanCalculator';
import { formatIndianCurrency } from '../utils/formatters';

interface AmortizationTableProps {
  loanDetails: LoanDetails;
  lumpSumPayments: LumpSumPayment[];
  emiIncreasePercentage: number;
  annualPrepayment: number;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({
  loanDetails,
  lumpSumPayments,
  emiIncreasePercentage,
  annualPrepayment,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const schedule = calculateAmortizationSchedule(
    loanDetails, 
    lumpSumPayments, 
    emiIncreasePercentage,
    annualPrepayment
  );

  const columns: GridColDef[] = [
    {
      field: 'month',
      headerName: 'Month',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'emi',
      headerName: 'EMI',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => formatIndianCurrency(params.value),
    },
    {
      field: 'principal',
      headerName: 'Principal',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => formatIndianCurrency(params.value),
    },
    {
      field: 'interest',
      headerName: 'Interest',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => formatIndianCurrency(params.value),
    },
    {
      field: 'remainingBalance',
      headerName: 'Balance',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => formatIndianCurrency(params.value),
    },
    {
      field: 'totalPrincipalPaid',
      headerName: 'Total Principal Paid',
      width: 180,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => formatIndianCurrency(params.value),
    },
    {
      field: 'totalInterestPaid',
      headerName: 'Total Interest Paid',
      width: 180,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params) => formatIndianCurrency(params.value),
    },
  ];

  const rows = schedule.map((entry, index) => ({
    id: index + 1,
    ...entry,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Amortization Schedule
      </Typography>
      
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          density="compact"
        />
      </Paper>
    </Box>
  );
};

export default AmortizationTable; 