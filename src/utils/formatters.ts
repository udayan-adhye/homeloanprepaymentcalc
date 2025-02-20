export const formatIndianNumber = (value: number | string): string => {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-IN').format(number);
};

export const formatIndianCurrency = (value: number | string): string => {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(number);
};

export const parseIndianNumber = (value: string): string => {
  return value.replace(/,/g, '');
}; 