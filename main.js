import { seaLevelPressureValue, altitudeValue, standardTemperatureValue, pressureUnitSelect, calculatedPressureOutput, pressurePercentageOutput, seaLevelPressureSlider, altitudeSlider, standardTemperatureSlider } from './htmlElements.js';
import { calculatePressure } from './pressureCalculation.js';
import { generatePressureChart } from './chartGeneration.js';
import { formatPressure } from './pressureUnits.js';
import { ALTITUDE_REFERENCES } from './altitudeReferences.js';

const scaleSwitch = document.getElementById('scaleSwitch');

// Initialize the sliders
noUiSlider.create(seaLevelPressureSlider, {
  start: [1013.25],
  range: {
    'min': [800],
    'max': [1100]
  }
});

// Initialize the sliders
noUiSlider.create(standardTemperatureSlider, {
  start: [15],
  range: {
    'min': [-50],
    'max': [50]
  }
});

noUiSlider.create(altitudeSlider, {
  start: [0],
  range: {
    'min': [0],
    'max': [100]
  }
});

// Function to update pressure output
function updatePressureOutput() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureSlider.noUiSlider.get());
  let altitude = parseFloat(altitudeSlider.noUiSlider.get());
  let standardTemperature = parseFloat(standardTemperatureSlider.noUiSlider.get());


  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(altitude) || isNaN(standardTemperature)) {
    calculatedPressureOutput.textContent = "Invalid input";
    return;
  }

  // Update displayed input values
  seaLevelPressureValue.value = seaLevelPressure.toFixed(2);
  altitudeValue.value = altitude.toFixed(2);
  standardTemperatureValue.value = standardTemperature.toFixed(2);

  // Calculate the pressure using the user's altitude input
  const calculatedPressure = calculatePressure(seaLevelPressure, altitude, standardTemperature);
  calculatedPressureOutput.textContent = formatPressure(calculatedPressure, pressureUnitSelect.value);
  pressurePercentageOutput.textContent = `${((calculatedPressure / seaLevelPressure) * 100).toFixed(1)}%`;
  updateComparisonTable(seaLevelPressure, standardTemperature, pressureUnitSelect.value);
}

function updateComparisonTable(seaLevelPressure, standardTemperature, pressureUnit) {
  const comparisonBody = document.getElementById('pressure-comparison-body');
  const comparisonRows = [
    { label: 'Sea level', altitude: 0 },
    ...ALTITUDE_REFERENCES
  ];

  comparisonBody.innerHTML = comparisonRows.map(function(reference) {
    const pressure = calculatePressure(seaLevelPressure, reference.altitude, standardTemperature);
    return `<tr><th scope="row">${reference.label || reference.shortLabel}</th><td>${reference.altitude.toFixed(2)} km</td><td>${formatPressure(pressure, pressureUnit)}</td></tr>`;
  }).join('');
}

// Function to update chart
function updateChart() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureSlider.noUiSlider.get());
  let standardTemperature = parseFloat(standardTemperatureValue.value);
              
  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(standardTemperature)) {
    return;
  }

  // Generate the pressure chart
  generatePressureChart(seaLevelPressure, standardTemperature, scaleSwitch.checked, pressureUnitSelect.value);
}

// Add event listeners to slider elements
seaLevelPressureSlider.noUiSlider.on('update', function() {
  updatePressureOutput();
  updateChart();
});

// Add event listeners to slider elements
altitudeSlider.noUiSlider.on('update', function() {
  updatePressureOutput();
  updateChart();
});

standardTemperatureSlider.noUiSlider.on('update', function() {
  updatePressureOutput();
  updateChart();
});

// Add event listeners to input number fields
seaLevelPressureValue.addEventListener('input', function() {
  seaLevelPressureSlider.noUiSlider.set(this.value);
  updatePressureOutput();
  updateChart();
});

altitudeValue.addEventListener('input', function() {
  altitudeSlider.noUiSlider.set(this.value);
  updatePressureOutput();
  updateChart();  // necessary to update the x axis marker on the chart
});

standardTemperatureValue.addEventListener('input', function() {
  standardTemperatureSlider.noUiSlider.set(this.value);
  updatePressureOutput();
  updateChart();
});

// Add an event listener to the unit selector
pressureUnitSelect.addEventListener('change', function() {
  updatePressureOutput();
  updateChart();
});

// Add an event listener to the altitude reference buttons
document.querySelectorAll('[data-reference-altitude]').forEach(function(referenceButton) {
  referenceButton.addEventListener('click', function() {
    altitudeValue.value = this.dataset.referenceAltitude;
    altitudeValue.dispatchEvent(new Event('input', { bubbles: true }));
  });
});

// Add an event listener to the switch
scaleSwitch.addEventListener('change', function() {
  // Call the updateChart function to redraw the chart with the new scale
  updateChart();
});

// Initial call to update function
document.addEventListener('DOMContentLoaded', function() {
  updatePressureOutput();
  updateChart();
});

