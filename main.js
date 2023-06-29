import { seaLevelPressureValue, altitudeValue, standardTemperatureValue, calculatedPressureOutput, seaLevelPressureSlider, altitudeSlider } from './htmlElements.js';
import { calculatePressure } from './pressureCalculation.js';
import { generatePressureChart } from './chartGeneration.js';

const scaleSwitch = document.getElementById('scaleSwitch');

// Initialize the sliders
noUiSlider.create(seaLevelPressureSlider, {
  start: [1013.25],
  range: {
    'min': [800],
    'max': [1100]
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
  let standardTemperature = parseFloat(standardTemperatureValue.value);

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
  calculatedPressureOutput.textContent = calculatedPressure.toFixed(2);
}

// Function to update chart
function updateChart() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureSlider.noUiSlider.get());
  console.log("updateChart - seaLevelPressure: " + seaLevelPressure);
  let standardTemperature = parseFloat(standardTemperatureValue.value);
  console.log("updateChart - standardTemperature: " + standardTemperature);
              
  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(standardTemperature)) {
    return;
  }

  // Generate the pressure chart
  generatePressureChart(seaLevelPressure, standardTemperature, scaleSwitch.checked);
}

// Add event listeners to slider elements
seaLevelPressureSlider.noUiSlider.on('update', function() {
  updatePressureOutput();
  updateChart();
});

altitudeSlider.noUiSlider.on('update', updatePressureOutput);

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
  updatePressureOutput();
  updateChart();
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
