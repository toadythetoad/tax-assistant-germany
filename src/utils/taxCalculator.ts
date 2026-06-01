export function calculateTax(
  grossIncome: number,
  advertisingCosts: number,
  specialExpenses: number,
  state: string,
  children: number = 0,
  churchTaxEnabled: boolean = false
) {
  const taxableIncome = Math.max(0, grossIncome - advertisingCosts - specialExpenses - (children * 9408));

  let incomeTax = 0;
  if (taxableIncome > 277826) {
    incomeTax = taxableIncome * 0.45 - 17720.06;
  } else if (taxableIncome > 66760) {
    const y = (taxableIncome - 66760) / 15430;
    incomeTax = (y * 0.42 + 16427.72) * y + 9396.58;
  } else if (taxableIncome > 17005) {
    const y = (taxableIncome - 17005) / 24900;
    incomeTax = (y * 0.4 + 2081.56) * y;
  } else if (taxableIncome > 11604) {
    const y = (taxableIncome - 11604) / 16327;
    incomeTax = (1008.7 * y + 1400) * y;
  }
  incomeTax = Math.round(incomeTax);

  let solidaritySurcharge = 0;
  if (incomeTax > 18000) {
    solidaritySurcharge = Math.round(incomeTax * 0.055);
  }

  let churchTax = 0;
  if (churchTaxEnabled && incomeTax > 0) {
    const churchRate = (state === 'BY' || state === 'BW') ? 0.08 : 0.09;
    churchTax = Math.round(incomeTax * churchRate);
  }

  const totalTax = incomeTax + solidaritySurcharge + churchTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome * 100) : 0;
  const marginalRate = taxableIncome > 277826 ? 45 : taxableIncome > 66760 ? 42 : 24;

  return {
    grossIncome,
    advertisingCosts,
    specialExpenses,
    childAllowance: children * 9408,
    taxableIncome,
    incomeTax,
    solidaritySurcharge,
    churchTax,
    totalTax,
    effectiveTaxRate: effectiveRate.toFixed(1),
    marginalTaxRate: marginalRate,
    netIncome: grossIncome - totalTax,
  };
}
