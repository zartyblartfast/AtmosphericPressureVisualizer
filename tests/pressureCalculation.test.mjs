import assert from 'node:assert/strict';
import { calculatePressure } from '../pressureCalculation.js';
import { TROPOSPHERE_LAPSE_RATE } from '../constants.js';

const seaLevelPressure = 1013.25;
const standardTemperature = 15;
const altitude = 10;

const g = 9.80665;
const m = 0.0289644;
const R = 8.3144598;
const temperatureAtAltitudeK = standardTemperature + (TROPOSPHERE_LAPSE_RATE * altitude) + 273.15;
const expectedPressure = seaLevelPressure * Math.exp(-(g * m * altitude * 1000) / (R * temperatureAtAltitudeK));
const actualPressure = calculatePressure(seaLevelPressure, altitude, standardTemperature);

assert.ok(
  Math.abs(actualPressure - expectedPressure) < 0.000001,
  `Expected signed lapse rate calculation ${expectedPressure}, got ${actualPressure}`
);

console.log('pressure calculation tests passed');
