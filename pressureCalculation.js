import { TROPOSPHERE_LAPSE_RATE, STRATOSPHERE_LAPSE_RATE, MESOSPHERE_LAPSE_RATE } from './constants.js';

// Function calculatePressure
export function calculatePressure(seaLevelPressure, altitude, standardTemperature) {
  const g = 9.80665; // gravitational acceleration
  const m = 0.0289644; // molar mass of dry air
  const R = 8.3144598; // universal gas constant

  let temperatureLapseRate;
  if (altitude <= 11) {
    temperatureLapseRate = TROPOSPHERE_LAPSE_RATE;
  } else if (altitude <= 20) {
    temperatureLapseRate = 0;
  } else if (altitude <= 32) {
    temperatureLapseRate = STRATOSPHERE_LAPSE_RATE;
  } else if (altitude <= 47) {
    temperatureLapseRate = 0;
  } else if (altitude <= 85) {
    temperatureLapseRate = MESOSPHERE_LAPSE_RATE;
  } else {
    temperatureLapseRate = 0;
  }

  // Calculate the temperature at the given altitude
  let temperatureAtAltitude = standardTemperature - (temperatureLapseRate * altitude);

  // Ensure temperature doesn't go below absolute zero
  if (temperatureAtAltitude < -273.15) {
    temperatureAtAltitude = -273.15;
  }

  // Adjust temperature from Celsius to Kelvin
  const temperatureAtAltitudeK = temperatureAtAltitude + 273.15;

  // Calculate the pressure at the given altitude
  const pressure = seaLevelPressure * Math.exp(-(g * m * altitude * 1000) / (R * temperatureAtAltitudeK));

  return pressure;
}
