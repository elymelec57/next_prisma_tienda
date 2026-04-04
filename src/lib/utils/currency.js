export const getCurrencySymbol = (currency) => {
  return currency === 'COP' ? 'COP ' : '$';
};

export const formatCurrency = (amount, currency) => {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formattedAmount}`;
};
