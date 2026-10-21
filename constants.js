// Reference lower-atmosphere layers: geopotential km, signed K/km (= °C/km).
// The rounded reference top is 84.852 H km; integration continues in the last
// layer to exactly 86 geometric km (H = 84.8520458... km).
export const LOWER_ATMOSPHERE_LAYERS = Object.freeze([
  { baseHeightKm: 0, topHeightKm: 11, lapseRate: -6.5 },
  { baseHeightKm: 11, topHeightKm: 20, lapseRate: 0 },
  { baseHeightKm: 20, topHeightKm: 32, lapseRate: 1 },
  { baseHeightKm: 32, topHeightKm: 47, lapseRate: 2.8 },
  { baseHeightKm: 47, topHeightKm: 51, lapseRate: 0 },
  { baseHeightKm: 51, topHeightKm: 71, lapseRate: -2.8 },
  { baseHeightKm: 71, topHeightKm: 84.852, lapseRate: -2 }
].map(Object.freeze));

export const EARTH_RADIUS_KM = 6356.766;
export const HYDROSTATIC_CONSTANT = 34.1632; // K/km
export const LOWER_ATMOSPHERE_TOP_KM = 86; // geometric km
export const xMax = 100;
