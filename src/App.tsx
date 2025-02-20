import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CssBaseline,
  Tabs,
  Tab,
  alpha,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoanDetails, LumpSumPayment } from './types/loan';
import LoanInputForm from './components/LoanInputForm';
import PrepaymentForm from './components/PrepaymentForm';
import LoanSummaryCard from './components/LoanSummaryCard';
import AmortizationTable from './components/AmortizationTable';
import PrepaymentImpactCard from './components/PrepaymentImpactCard';
import ExistingLoanForm from './components/ExistingLoanForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00D09C',  // Groww's primary green color
      light: '#33D8B0',
      dark: '#00A77D',
    },
    secondary: {
      main: '#7B3FE4',
      light: '#9B69FF',
      dark: '#5C2EA6',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#44475B',
      secondary: '#7C7E8C',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.02em',
      color: '#44475B',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
      color: '#44475B',
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#7C7E8C',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: { xs: '16px', sm: '24px' },
          borderRadius: '12px',
          boxShadow: 'none',
          border: '1px solid #F0F0F0',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: { xs: '0.875rem', sm: '1rem' },
          fontWeight: 500,
          minWidth: { xs: 100, sm: 120 },
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            fontWeight: 600,
            color: '#00D09C',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          backgroundColor: '#00D09C',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(236, 252, 247, 0.6)',
            '&:hover': {
              backgroundColor: 'rgba(236, 252, 247, 0.8)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(236, 252, 247, 0.8)',
            },
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loan-tabpanel-${index}`}
      aria-labelledby={`loan-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [lumpSumPayments, setLumpSumPayments] = useState<LumpSumPayment[]>([]);
  const [emiIncreasePercentage, setEmiIncreasePercentage] = useState<number>(0);
  const [annualPrepayment, setAnnualPrepayment] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setLoanDetails(null);
    setLumpSumPayments([]);
    setEmiIncreasePercentage(0);
    setAnnualPrepayment(0);
  };

  const renderLoanResults = () => (
    <>
      <Paper sx={{ mb: 3 }}>
        <LoanSummaryCard
          loanDetails={loanDetails!}
          lumpSumPayments={lumpSumPayments}
          emiIncreasePercentage={emiIncreasePercentage}
          annualPrepayment={annualPrepayment}
        />
      </Paper>
      
      <Paper>
        <PrepaymentImpactCard
          loanDetails={loanDetails!}
          lumpSumPayments={lumpSumPayments}
          emiIncreasePercentage={emiIncreasePercentage}
          annualPrepayment={annualPrepayment}
        />
      </Paper>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Box 
          sx={{ 
            bgcolor: 'background.default',
            minHeight: '100dvh',
            py: { xs: 2, sm: 4, md: 6 },
            backgroundImage: 'linear-gradient(135deg, rgba(46, 92, 255, 0.05) 0%, rgba(123, 63, 228, 0.05) 100%)',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              Home Loan Calculator
            </Typography>
            <Typography 
              variant="subtitle1" 
              align="center" 
              color="text.secondary" 
              sx={{ 
                mb: { xs: 3, sm: 4, md: 6 },
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                px: 2,
              }}
            >
              Calculate your loan EMI and analyze the impact of prepayments with our advanced calculator
            </Typography>

            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: 'background.paper',
              borderRadius: '16px 16px 0 0',
              padding: { xs: '4px', sm: '8px' },
            }}>
              <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                centered
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundImage: 'linear-gradient(135deg, #2E5CFF 0%, #7B3FE4 100%)',
                  },
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    minWidth: { xs: 100, sm: 120 },
                    py: { xs: 1, sm: 1.5 },
                  }
                }}
              >
                <Tab label="New Loan" />
                <Tab label="Existing Loan" />
              </Tabs>
            </Box>

            <TabPanel value={tabIndex} index={0}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ mb: { xs: 2, sm: 3 }, p: { xs: 2, sm: 3, md: 4 } }}>
                    <LoanInputForm onSubmit={setLoanDetails} />
                  </Paper>
                  
                  <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <PrepaymentForm
                      onLumpSumAdd={(payment) => setLumpSumPayments([...lumpSumPayments, payment])}
                      onEmiIncreaseChange={setEmiIncreasePercentage}
                      onAnnualPrepaymentChange={setAnnualPrepayment}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  {loanDetails && renderLoanResults()}
                </Grid>

                {loanDetails && (
                  <Grid item xs={12}>
                    <Paper>
                      <AmortizationTable
                        loanDetails={loanDetails}
                        lumpSumPayments={lumpSumPayments}
                        emiIncreasePercentage={emiIncreasePercentage}
                        annualPrepayment={annualPrepayment}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ mb: { xs: 2, sm: 3 }, p: { xs: 2, sm: 3, md: 4 } }}>
                    <ExistingLoanForm onSubmit={setLoanDetails} />
                  </Paper>
                  
                  <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <PrepaymentForm
                      onLumpSumAdd={(payment) => setLumpSumPayments([...lumpSumPayments, payment])}
                      onEmiIncreaseChange={setEmiIncreasePercentage}
                      onAnnualPrepaymentChange={setAnnualPrepayment}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  {loanDetails && renderLoanResults()}
                </Grid>

                {loanDetails && (
                  <Grid item xs={12}>
                    <Paper>
                      <AmortizationTable
                        loanDetails={loanDetails}
                        lumpSumPayments={lumpSumPayments}
                        emiIncreasePercentage={emiIncreasePercentage}
                        annualPrepayment={annualPrepayment}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 