import {
  LOWER_ATMOSPHERE_LAYERS, EARTH_RADIUS_KM, HYDROSTATIC_CONSTANT,
  LOWER_ATMOSPHERE_TOP_KM, xMax
} from './constants.js';

// ITU-R P.835-6 Annex 1, equation (5); z is geometric km.
function upperLogPressure(z) {
  return 95.571899 + z * (-4.011801 + z * (0.06424731 +
    z * (-0.0004789660 + z * 0.000001340543)));
}

// Inputs: sea-level pressure in hPa, geometric altitude in km, sea-level °C.
// Off-standard T0 is an educational whole-lower-profile pressure-response
// assumption, not aviation ISA delta-T. Above 86 km only P86 is rescaled;
// the reference pressure-ratio shape is unchanged by the temperature offset.
export function calculatePressure(seaLevelPressure, altitude, standardTemperature) {
  if (!Number.isFinite(seaLevelPressure) || seaLevelPressure <= 0 ||
      !Number.isFinite(altitude) || altitude < 0 || altitude > xMax ||
      !Number.isFinite(standardTemperature)) {
    return NaN;
  }

  let temperature = standardTemperature + 273.15;
  if (temperature <= 0) return NaN;

  const lowerAltitude = Math.min(altitude, LOWER_ATMOSPHERE_TOP_KM);
  const height = EARTH_RADIUS_KM * lowerAltitude / (EARTH_RADIUS_KM + lowerAltitude);
  let pressure = seaLevelPressure;

  for (let i = 0; i < LOWER_ATMOSPHERE_LAYERS.length; i++) {
    const layer = LOWER_ATMOSPHERE_LAYERS[i];
    if (height <= layer.baseHeightKm) break;
    // Do not stop at the rounded 84.852 H km: join at exact geometric 86 km.
    const top = i === LOWER_ATMOSPHERE_LAYERS.length - 1
      ? height : Math.min(height, layer.topHeightKm);
    const deltaHeight = top - layer.baseHeightKm;
    const nextTemperature = temperature + layer.lapseRate * deltaHeight;
    // A linear profile is positive throughout iff both endpoints are positive.
    if (nextTemperature <= 0) return NaN;

    pressure *= layer.lapseRate === 0
      ? Math.exp(-HYDROSTATIC_CONSTANT * deltaHeight / temperature)
      : Math.pow(nextTemperature / temperature, -HYDROSTATIC_CONSTANT / layer.lapseRate);
    temperature = nextTemperature;
  }

  if (altitude > LOWER_ATMOSPHERE_TOP_KM) {
    pressure *= Math.exp(upperLogPressure(altitude) - upperLogPressure(LOWER_ATMOSPHERE_TOP_KM));
  }
  return pressure;
}
