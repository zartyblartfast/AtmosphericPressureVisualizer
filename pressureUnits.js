const HPA_PER_INHG = 33.86389;
const MMHG_PER_HPA = 0.75006168;
const PSI_PER_HPA = 0.01450377;
const HPA_PER_ATM = 1013.25;

export const PRESSURE_UNITS = {
  hPa: {
    label: 'hPa',
    name: 'Hectopascals',
    fromHpa: value => value,
    decimals: 2
  },
  mbar: {
    label: 'mbar',
    name: 'Millibars',
    fromHpa: value => value,
    decimals: 2
  },
  inHg: {
    label: 'inHg',
    name: 'Inches of mercury',
    fromHpa: value => value / HPA_PER_INHG,
    decimals: 3
  },
  kPa: {
    label: 'kPa',
    name: 'Kilopascals',
    fromHpa: value => value / 10,
    decimals: 3
  },
  mmHg: {
    label: 'mmHg',
    name: 'Millimetres of mercury',
    fromHpa: value => value * MMHG_PER_HPA,
    decimals: 2
  },
  psi: {
    label: 'psi',
    name: 'Pounds per square inch',
    fromHpa: value => value * PSI_PER_HPA,
    decimals: 3
  },
  atm: {
    label: 'atm',
    name: 'Atmospheres',
    fromHpa: value => value / HPA_PER_ATM,
    decimals: 4
  },
  Pa: {
    label: 'Pa',
    name: 'Pascals',
    fromHpa: value => value * 100,
    decimals: 0
  },
  bar: {
    label: 'bar',
    name: 'Bar',
    fromHpa: value => value / 1000,
    decimals: 5
  }
};

export function getPressureUnit(unitKey) {
  return PRESSURE_UNITS[unitKey] || PRESSURE_UNITS.hPa;
}

export function convertPressureFromHpa(valueInHpa, unitKey) {
  return getPressureUnit(unitKey).fromHpa(valueInHpa);
}

export function formatPressure(valueInHpa, unitKey) {
  const unit = getPressureUnit(unitKey);
  return `${convertPressureFromHpa(valueInHpa, unitKey).toFixed(unit.decimals)} ${unit.label}`;
}
