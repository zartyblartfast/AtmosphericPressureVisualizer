import { seaLevelPressureInput, altitudeInput, standardTemperatureInput, seaLevelPressureValue, altitudeValue, standardTemperatureValue, calculatedPressureOutput } from './htmlElements.js';
import { calculatePressure } from './pressureCalculation.js';
import { generatePressureChart } from './chartGeneration.js';

// Function to update pressure output
function updatePressureOutput() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  let altitude = parseFloat(altitudeInput.value);
  let standardTemperature = parseFloat(standardTemperatureInput.value);

  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(altitude) || isNaN(standardTemperature)) {
    calculatedPressureOutput.textContent = "Invalid input";
    return;
  }

  console.log("Sea Level Pressure: " + seaLevelPressure);
  console.log("Altitude: " + altitude);
  console.log("Standard Temperature: " + standardTemperature);

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
  let seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  let standardTemperature = parseFloat(standardTemperatureInput.value);

  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(standardTemperature)) {
    return;
  }

  console.log("Sea Level Pressure: " + seaLevelPressure);
  console.log("Standard Temperature: " + standardTemperature);

  // Generate the pressure chart
  generatePressureChart(seaLevelPressure, standardTemperature);
}

// Add event listeners to input fields
seaLevelPressureInput.addEventListener('input', function() {
  updatePressureOutput();
  updateChart();
});

altitudeInput.addEventListener('input', updatePressureOutput);
standardTemperatureInput.addEventListener('input', function() {
  updatePressureOutput();
  updateChart();
});

// Add event listeners to input number fields
seaLevelPressureValue.addEventListener('input', function() {
  seaLevelPressureInput.value = this.value;
  updatePressureOutput();
  updateChart();
});
altitudeValue.addEventListener('input', function() {
  altitudeInput.value = this.value;
  updatePressureOutput();
  updateChart();  // necessary to update the x axis marker on the chart
});
standardTemperatureValue.addEventListener('input', function() {
  standardTemperatureInput.value = this.value;
  updatePressureOutput();
  updateChart();
});

// Initial call to update function
document.addEventListener('DOMContentLoaded', function() {
  updatePressureOutput();
  updateChart();
});



