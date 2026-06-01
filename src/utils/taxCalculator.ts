// Einkommensteuertarif 2024 nach §32a EStG
// Grundtabelle (Single) / Splittingtabelle (married)

interface TaxInput {
  // Income
  incomeEmployment: number;
  incomeSelfEmployment: number;
  incomeCapital: number;
  incomeRental: number;
  incomePension: number;
  incomeOther: number;
  // Deductions
  expensesAdvertising: number;
  expensesSpecial: number;
  expensesHousehold: number;
  expensesExtraordinary: number;
  expensesDonations: number;
  expensesInsurance: number;
  // Profile
  maritalStatus: string;
  children: number;
  state: string;
  religion: string;
  // Already paid (from payslip OCR / forms)
  withholdingTax: number;      // Lohnsteuer already paid
  withholdingSoli: number;     // Solidaritätszuschlag already paid
  withholdingChurch: number;   // Kirchensteuer already paid
  capitalGainsWithholding: number; // Kapitalertragsteuer already paid
}

interface TaxResult {
  // Income
  grossIncome: number;
  advertisingCosts: number;
  specialExpenses: number;
  householdExpenses: number;
  extraordinaryExpenses: number;
  donations: number;
  insuranceExpenses: number;
  totalDeductions: number;
  // Allowances
  childAllowance: number;
  childBenefit: number;
  childBenefitMonths: number;
  // Taxable
  taxableIncome: number;
  splittingFactor: number;
  // Tax liability
  incomeTax: number;
  solidaritySurcharge: number;
  churchTax: number;
  totalTax: number;
  // Already paid
  alreadyPaidLohnsteuer: number;
  alreadyPaidSoli: number;
  alreadyPaidChurch: number;
  alreadyPaidKapital: number;
  totalAlreadyPaid: number;
  // Balance
  balance: number; // positive = Nachzahlung, negative = Rückzahlung
  // Rates
  effectiveTaxRate: string;
  marginalTaxRate: number;
}

const GRUNDFREIBETRAG = 11604;
const GRUNDFREIBETRAG_MARRIED = 23208;

// Kinderfreibetrag 2024 (€3.306 pro Elternteil + €2.928 Betreuung = €6.132 + €2.928 = €9.060)
// Actually for 2024: Kinderfreibetrag €6.612 (€3.306 × 2) + BEA €2.928 = €9.540
const CHILD_ALLOWANCE_PER_CHILD = 9540;

// Kindergeld 2024: €250/Kind/Monat
const CHILD_BENEFIT_PER_CHILD_MONTH = 250;

// Werbungskostenpauschbetrag 2024
const ADVERTISING_PAUSCHALE = 1230;

// Sonderausgabenpauschbetrag 2024  
const SPECIAL_PAUSCHALE = 36;

function tariff2024Single(zve: number): number {
  if (zve <= GRUNDFREIBETRAG) return 0;

  if (zve <= 17005) {
    // Erste Progressionszone
    const y = (zve - GRUNDFREIBETRAG) / 16327;
    return Math.round((1008.70 * y + 1400) * y);
  }

  if (zve <= 66760) {
    // Zweite Progressionszone
    const y = (zve - 17005) / 24900;
    return Math.round((241.06 * y + 2081.56) * y + 965.58);
  }

  if (zve <= 277825) {
    // Spitzensteuerzone
    return Math.round(0.42 * zve - 10928.37);
  }

  // Reichensteuerzone
  return Math.round(0.45 * zve - 19260.05);
}

function calculateSoli(incomeTax: number, splittingFactor: number): number {
  const freigrenze = 18000 * splittingFactor;
  if (incomeTax <= freigrenze) return 0;
  const soli = Math.round(incomeTax * 0.055);
  // Milderungszone (simplified: for very small amounts over the threshold)
  // Full Soli applies when incomeTax > freigrenze * 1.0 (simplified)
  return soli;
}

function calculateChurchTax(incomeTax: number, state: string, religion: string): number {
  if (religion === 'none' || religion === 'other' || religion === 'muslim' || religion === 'jewish') return 0;
  if (incomeTax <= 0) return 0;
  const rate = (state === 'BY' || state === 'BW') ? 0.08 : 0.09;
  return Math.round(incomeTax * rate);
}

// Kindergeld vs Kinderfreibetrag: Günstigerprüfung
function childTaxAdvantage(incomeTax: number, children: number, childBenefitMonths: number): {
  childAllowance: number;
  childBenefit: number;
} {
  const allowance = children * CHILD_ALLOWANCE_PER_CHILD;
  const benefit = children * CHILD_BENEFIT_PER_CHILD_MONTH * childBenefitMonths;
  return { childAllowance: allowance, childBenefit: benefit };
}

export function calculateTax(input: TaxInput): TaxResult {
  // Gross income
  const grossIncome =
    (input.incomeEmployment || 0) +
    (input.incomeSelfEmployment || 0) +
    (input.incomeCapital || 0) +
    (input.incomeRental || 0) +
    (input.incomePension || 0) +
    (input.incomeOther || 0);

  // Deductions (use actual or Pauschale, whichever is higher for advertising)
  const advertisingCosts = Math.max(input.expensesAdvertising || 0, ADVERTISING_PAUSCHALE);
  const specialExpenses = Math.max(input.expensesSpecial || 0, SPECIAL_PAUSCHALE);
  const householdExpenses = input.expensesHousehold || 0;
  const extraordinaryExpenses = input.expensesExtraordinary || 0;
  const donations = input.expensesDonations || 0;
  const insuranceExpenses = input.expensesInsurance || 0;

  const totalDeductions = advertisingCosts + specialExpenses + householdExpenses +
    extraordinaryExpenses + donations + insuranceExpenses;

  // Splitting factor (1 = single, 2 = married)
  const isMarried = input.maritalStatus === 'married';
  const splittingFactor = isMarried ? 2 : 1;

  // Child allowance / benefit
  const children = Math.max(0, input.children || 0);
  const childBenefitMonths = 12; // default full year
  const { childAllowance, childBenefit } = childTaxAdvantage(0, children, childBenefitMonths);

  // Taxable income after deductions and child allowance
  let taxableIncome = Math.max(0, grossIncome - totalDeductions - childAllowance);

  // If married, apply splitting: calculate on half, then double
  let incomeTax: number;
  if (isMarried) {
    incomeTax = tariff2024Single(taxableIncome / 2) * 2;
  } else {
    incomeTax = tariff2024Single(taxableIncome);
  }

  // Solidaritätszuschlag
  const solidaritySurcharge = calculateSoli(incomeTax, splittingFactor);

  // Kirchensteuer
  const churchTax = calculateChurchTax(incomeTax, input.state, input.religion);

  // Total tax liability
  const totalTax = incomeTax + solidaritySurcharge + churchTax;

  // Already paid taxes
  const alreadyPaidLohnsteuer = input.withholdingTax || 0;
  const alreadyPaidSoli = input.withholdingSoli || 0;
  const alreadyPaidChurch = input.withholdingChurch || 0;
  const alreadyPaidKapital = input.capitalGainsWithholding || 0;
  const totalAlreadyPaid = alreadyPaidLohnsteuer + alreadyPaidSoli + alreadyPaidChurch + alreadyPaidKapital;

  // Balance: positive = Nachzahlung, negative = Rückzahlung
  const balance = totalTax - totalAlreadyPaid;

  // Rates
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome * 100) : 0;
  let marginalTaxRate = 0;
  if (taxableIncome > 277825) marginalTaxRate = 45;
  else if (taxableIncome > 66760) marginalTaxRate = 42;
  else if (taxableIncome > 17005) marginalTaxRate = 24;
  else if (taxableIncome > GRUNDFREIBETRAG) marginalTaxRate = 14;
  else marginalTaxRate = 0;

  return {
    grossIncome,
    advertisingCosts,
    specialExpenses,
    householdExpenses,
    extraordinaryExpenses,
    donations,
    insuranceExpenses,
    totalDeductions,
    childAllowance,
    childBenefit,
    childBenefitMonths,
    taxableIncome,
    splittingFactor,
    incomeTax,
    solidaritySurcharge,
    churchTax,
    totalTax,
    alreadyPaidLohnsteuer,
    alreadyPaidSoli,
    alreadyPaidChurch,
    alreadyPaidKapital,
    totalAlreadyPaid,
    balance,
    effectiveTaxRate: effectiveRate.toFixed(1),
    marginalTaxRate,
  };
}
