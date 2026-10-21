import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePressure } from '../pressureCalculation.js';

const P0 = 1013.25;
const RADIUS_KM = 6356.766;
const geometric = H => RADIUS_KM * H / (RADIUS_KM - H);
const pressure = (z, temperature = 15, p0 = P0) => calculatePressure(p0, z, temperature);
function near(actual, expected, relativeTolerance, description) {
  assert.ok(Number.isFinite(actual) && Math.abs(actual / expected - 1) <= relativeTolerance,
    `${description}: expected ${expected}, got ${actual}`);
}

// Independent reference values, not an implementation of the pressure equations:
// U.S. Standard Atmosphere 1976 (NASA NTRS 19770009539), lower tables;
// ITU-R P.835-6 Annex 1, reference atmosphere (geometric-height values).
// Upper values allow 0.1% for the reference pressure-fit/86 km normalization.
test('published lower-atmosphere geopotential anchors', () => {
  for (const [H, expected] of [
    [11, 226.3226], [20, 54.7498], [32, 8.68014],
    [47, 1.10906], [51, 0.669384], [71, 0.0395642]
  ]) {
    near(pressure(geometric(H)), expected, 0.0001, `H=${H} km (hPa)`);
  }
});

test('published geometric-height anchors and upper atmosphere', () => {
  for (const [z, expected, tolerance] of [
    [10, 264.99893, 0.0001], [11, 226.99956, 0.0001],
    [30, 11.97031, 0.0001], [85, 0.004456799, 0.0001],
    [86, 0.0037338, 0.001], [90, 0.0018359, 0.001],
    [100, 0.000320124, 0.001]
  ]) {
    near(pressure(z), expected, tolerance, `z=${z} km (hPa)`);
  }
});

test('altitude is geometric, not geopotential', () => {
  near(pressure(geometric(11)), 226.3226, 0.0001, '11 geopotential km');
  near(pressure(11), 226.99956, 0.0001, '11 geometric km');
  assert.ok(pressure(11) > pressure(geometric(11)));
});

test('exact sea-level pressure and linear pressure scaling', () => {
  for (const t of [-50, 15, 50]) {
    for (const p0 of [800, P0, 1100]) {
      assert.equal(pressure(0, t, p0), p0);
      for (const z of [1, 11, 32, 51, 71, 86, 90, 100]) {
        near(pressure(z, t, p0), pressure(z, t) * p0 / P0, 1e-12, 'P0 scaling');
      }
    }
  }
});

test('continuous and decreasing at true layer boundaries, 86 km, and old breakpoints', () => {
  const boundaries = [...[11, 20, 32, 47, 51, 71, 84.852].map(geometric),
    11, 20, 32, 47, 85, 86];
  for (const t of [-50, 15, 50]) {
    for (const z of boundaries) {
      const below = pressure(z - 1e-6, t);
      const at = pressure(z, t);
      const above = pressure(z + 1e-6, t);
      assert.ok(below > at && at > above, `decreasing at ${z} km, T0=${t}`);
      near(below, at, 1e-6, 'left continuity');
      near(above, at, 1e-6, 'right continuity');
    }
  }
});

test('positive, finite, strictly decreasing over 0–100 km at all UI extremes', () => {
  for (const t of [-50, 15, 50]) {
    for (const p0 of [800, P0, 1100]) {
      let previous = Infinity;
      for (let i = 0; i <= 1000; i++) {
        const current = pressure(i / 10, t, p0);
        assert.ok(Number.isFinite(current) && current > 0 && current < previous,
          `z=${i / 10}, T0=${t}, P0=${p0}: ${current}`);
        previous = current;
      }
    }
  }
});

test('nonstandard temperatures reintegrate the lower profile and scale only the upper boundary', () => {
  for (const z of [1, 11, 20, 32, 47, 51, 71, 85, 86, 95, 100]) {
    assert.ok(pressure(z, -50) < pressure(z) && pressure(z) < pressure(z, 50),
      `warmer whole profile retains more pressure at ${z} km`);
  }
  for (const t of [-50, 50]) {
    for (const z of [87, 90, 95, 100]) {
      near(pressure(z, t) / pressure(86, t), pressure(z) / pressure(86), 1e-12,
        'upper reference ratio independent of temperature offset');
    }
  }
});

test('invalid inputs return NaN without exceptions', () => {
  for (const value of [NaN, Infinity, -Infinity, undefined, null, '15', {}, Symbol('invalid')]) {
    for (const args of [[value, 10, 15], [P0, value, 15], [P0, 10, value]]) {
      assert.ok(Number.isNaN(calculatePressure(...args)), 'non-finite/non-number input');
    }
  }
  for (const args of [
    [0, 10, 15], [-1, 10, 15], [P0, -0.01, 15], [P0, 100.01, 15],
    [P0, 0, -273.15], [P0, 10, -300],
    // Positive sea-level temperature but zero/negative within the traversed profile.
    [P0, geometric(11), -201.65], [P0, 100, -190]
  ]) {
    assert.ok(Number.isNaN(calculatePressure(...args)), `invalid domain: ${args}`);
  }
  // Validate only traversed layers, not temperatures at unvisited heights.
  assert.equal(pressure(0, -250), P0);
  assert.ok(pressure(0.1, -250) > 0);
});
