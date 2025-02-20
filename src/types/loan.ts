export interface LoanDetails {
  principal: number;
  interestRate: number;
  loanTerm: number;
  emiIncreasePercentage?: number;
  startDate?: Date;
  originalPrincipal?: number;
  originalTerm?: number;
  monthlyEMI?: number;
}

export interface LumpSumPayment {
  amount: number;
  date: Date;
}

export interface LoanSummary {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  totalPrincipal: number;
  loanEndDate: Date;
}

export interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
}

export interface PrepaymentImpact {
  interestSaved: number;
  timeSaved: number;
  newLoanEndDate: Date;
  newTotalAmount: number;
} 