import { LoanDetails, LoanSummary, AmortizationEntry, LumpSumPayment, PrepaymentImpact } from '../types/loan';
import dayjs from 'dayjs';

export const calculateEMI = (principal: number, annualRate: number, termInYears: number): number => {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = termInYears * 12;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

export const calculateLoanSummary = (loanDetails: LoanDetails): LoanSummary => {
  const monthlyEMI = loanDetails.monthlyEMI || calculateEMI(loanDetails.principal, loanDetails.interestRate, loanDetails.loanTerm);
  const totalAmount = monthlyEMI * loanDetails.loanTerm * 12;
  const totalInterest = totalAmount - loanDetails.principal;
  const loanEndDate = loanDetails.startDate 
    ? dayjs(loanDetails.startDate).add(loanDetails.loanTerm, 'year').toDate()
    : dayjs().add(loanDetails.loanTerm, 'year').toDate();

  return {
    monthlyEMI,
    totalInterest,
    totalAmount,
    totalPrincipal: loanDetails.principal,
    loanEndDate,
  };
};

const getMonthFromDate = (date: Date, startDate: Date): number => {
  return dayjs(date).diff(dayjs(startDate), 'month') + 1;
};

export const calculateAmortizationSchedule = (
  loanDetails: LoanDetails,
  lumpSumPayments: LumpSumPayment[] = [],
  emiIncreasePercentage: number = 0,
  annualPrepayment: number = 0
): AmortizationEntry[] => {
  const schedule: AmortizationEntry[] = [];
  let remainingBalance = loanDetails.principal;
  let monthlyRate = loanDetails.interestRate / 12 / 100;
  let baseEMI = loanDetails.monthlyEMI || calculateEMI(loanDetails.principal, loanDetails.interestRate, loanDetails.loanTerm);
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  const startDate = loanDetails.startDate || new Date();

  // Convert lumpsum payment dates to month numbers
  const lumpSumByMonth = lumpSumPayments.map(payment => ({
    amount: payment.amount,
    month: getMonthFromDate(payment.date, startDate),
  }));

  for (let month = 1; month <= loanDetails.loanTerm * 12 && remainingBalance > 0; month++) {
    // Apply EMI increase if applicable
    if (emiIncreasePercentage > 0 && month % 12 === 1 && month > 1) {
      baseEMI *= (1 + emiIncreasePercentage / 100);
    }

    let currentEMI = Math.min(baseEMI, remainingBalance * (1 + monthlyRate));
    let interestForMonth = remainingBalance * monthlyRate;
    let principalForMonth = currentEMI - interestForMonth;

    // Apply lump sum payment if any for this month
    const lumpSum = lumpSumByMonth.find(payment => payment.month === month);
    if (lumpSum) {
      principalForMonth += lumpSum.amount;
    }

    // Apply annual prepayment if it's the last month of any year
    if (annualPrepayment > 0 && month % 12 === 0) {
      principalForMonth += annualPrepayment;
    }

    // Ensure we don't overpay
    if (principalForMonth > remainingBalance) {
      principalForMonth = remainingBalance;
      currentEMI = principalForMonth + interestForMonth;
    }

    remainingBalance -= principalForMonth;
    totalPrincipalPaid += principalForMonth;
    totalInterestPaid += interestForMonth;

    schedule.push({
      month,
      emi: currentEMI,
      principal: principalForMonth,
      interest: interestForMonth,
      remainingBalance,
      totalPrincipalPaid,
      totalInterestPaid,
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
};

export const calculatePrepaymentImpact = (
  loanDetails: LoanDetails,
  lumpSumPayments: LumpSumPayment[],
  emiIncreasePercentage: number,
  annualPrepayment: number = 0
): PrepaymentImpact => {
  const originalSchedule = calculateAmortizationSchedule(loanDetails);
  const modifiedSchedule = calculateAmortizationSchedule(
    loanDetails, 
    lumpSumPayments, 
    emiIncreasePercentage,
    annualPrepayment
  );

  const originalTotalInterest = originalSchedule[originalSchedule.length - 1].totalInterestPaid;
  const modifiedTotalInterest = modifiedSchedule[modifiedSchedule.length - 1].totalInterestPaid;
  const timeSaved = originalSchedule.length - modifiedSchedule.length;

  const startDate = loanDetails.startDate || new Date();
  const newLoanEndDate = dayjs(startDate).add(modifiedSchedule.length, 'month').toDate();

  return {
    interestSaved: originalTotalInterest - modifiedTotalInterest,
    timeSaved,
    newLoanEndDate,
    newTotalAmount: modifiedSchedule[modifiedSchedule.length - 1].totalPrincipalPaid + 
                    modifiedSchedule[modifiedSchedule.length - 1].totalInterestPaid,
  };
}; 