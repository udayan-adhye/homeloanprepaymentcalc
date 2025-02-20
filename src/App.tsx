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
      main: '#2E5CFF',
      light: '#5B7FFF',
      dark: '#1E3ECC',
    },
    secondary: {
      main: '#7B3FE4',
      light: '#9B69FF',
      dark: '#5C2EA6',
    },
    background: {
      default: '#F8FAFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1F36',
      secondary: '#4F566B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.125rem',
      letterSpacing: '-0.02em',
      backgroundImage: 'linear-gradient(135deg, #2E5CFF 0%, #7B3FE4 100%)',
      backgroundClip: 'text',
      color: 'transparent',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontSize: '1.1rem',
      lineHeight: 1.5,
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
          padding: '28px',
          borderRadius: '16px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 500,
          minWidth: 120,
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 1200px)': {
            maxWidth: '1200px',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
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
            minHeight: '100vh', 
            py: 6,
            backgroundImage: 'linear-gradient(135deg, rgba(46, 92, 255, 0.05) 0%, rgba(123, 63, 228, 0.05) 100%)',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
              Home Loan Calculator
            </Typography>
            <Typography 
              variant="subtitle1" 
              align="center" 
              color="text.secondary" 
              sx={{ 
                mb: 6,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Calculate your loan EMI and analyze the impact of prepayments with our advanced calculator
            </Typography>

            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              mb: 4,
              backgroundColor: 'background.paper',
              borderRadius: '16px 16px 0 0',
              padding: '8px',
            }}>
              <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                centered
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundImage: 'linear-gradient(135deg, #2E5CFF 0%, #7B3FE4 100%)',
                  }
                }}
              >
                <Tab label="New Loan" />
                <Tab label="Existing Loan" />
              </Tabs>
            </Box>

            <TabPanel value={tabIndex} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ mb: 3 }}>
                    <LoanInputForm onSubmit={setLoanDetails} />
                  </Paper>
                  
                  <Paper>
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
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ mb: 3 }}>
                    <ExistingLoanForm onSubmit={setLoanDetails} />
                  </Paper>
                  
                  <Paper>
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