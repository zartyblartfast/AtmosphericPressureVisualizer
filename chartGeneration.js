let chart; // Add this line at the start of your chartGeneration.js file

import { calculatePressure } from './pressureCalculation.js';
import { altitudeSlider } from './htmlElements.js';
import { LOWER_ATMOSPHERE_LAYERS, EARTH_RADIUS_KM, LOWER_ATMOSPHERE_TOP_KM, xMax } from './constants.js';
import { convertPressureFromHpa, getPressureUnit } from './pressureUnits.js';
import { ALTITUDE_REFERENCES } from './altitudeReferences.js';

export function generatePressureChart(seaLevelPressure, standardTemperature, isLogarithmic, pressureUnit = 'hPa') {
  const ctx = document.getElementById('pressure-chart').getContext('2d');
  const unit = getPressureUnit(pressureUnit);
  const yAxisMin = isLogarithmic ? convertPressureFromHpa(0.1, pressureUnit) : 0;
  const yAxisMax = convertPressureFromHpa(1200, pressureUnit);

  // Constants for atmospheric layer boundaries
  const TROPOSPHERE = 11; // in km
  const STRATOSPHERE = 50; // in km
  const MESOSPHERE = 80; // in km
  const THERMOSPHERE = xMax; // in km

  // Data for chart
  let data = {
    labels: [], // This array will be populated with altitude values
    datasets: [{
      label: `Air Pressure (${unit.label})`,
      data: [], // This array will be populated with pressure values
      fill: false,
      //borderColor: 'rgb(75, 192, 192)',
      borderColor: 'rgb(0, 0, 0)', // Black color
      tension: 0.1
      //,pointRadius: 5 // line and legent point size
    }]
  };

  // Generate data
  for (let i = 0; i <= 100; i += 1) { // Fixed range to 100 Km
    data.labels.push(i.toFixed(1));
    let pressureAtAltitude = calculatePressure(seaLevelPressure, i, standardTemperature);
    let displayPressureAtAltitude = convertPressureFromHpa(pressureAtAltitude, pressureUnit);

    data.datasets[0].data.push(displayPressureAtAltitude);

  }

  // If chart exists, destroy it before creating a new one
  if (chart) {
    chart.destroy();
  }

// Chart.js plugin for drawing rectangles
const drawRectanglesPlugin = {
  id: 'drawRectangles',
  beforeDraw(chart, args, options) {
    const {ctx, scales} = chart;
    const {x, y} = scales;

    function darkenColor(color, factor) {
      let rgba = color.slice(5, -1).split(', '); // Get the r, g, b, a values
      let r = Math.floor(parseInt(rgba[0]) * factor);
      let g = Math.floor(parseInt(rgba[1]) * factor);
      let b = Math.floor(parseInt(rgba[2]) * factor);
      let a = rgba[3]; // Keep the same alpha value
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
    
    function drawRectangle(start, end, color, text) {
      const xStart = x.getPixelForValue(start);
      const xEnd = x.getPixelForValue(end);
      const yTop = y.getPixelForValue(y.max);
      const yBottom = y.getPixelForValue(y.min);

    
      ctx.fillStyle = color;
      ctx.fillRect(xStart, yTop, xEnd - xStart, yBottom - yTop);
    
      // Draw text in the middle of the rectangle
      ctx.save(); // Save the current state
      ctx.fillStyle = darkenColor(color, 0.1); // Darker shade of the rectangle color
      ctx.font = '14px Arial';
      const textWidth = ctx.measureText(text).width;
      const textX = (xStart + xEnd) / 2; // Center the text
      const textY = yTop + (yBottom - yTop) * 0.1 + textWidth / 2; // Shift the text upwards
      ctx.translate(textX, textY);
      ctx.rotate(-Math.PI / 2); // Rotate the canvas
      ctx.fillText(text, -textWidth / 2, 0);
      ctx.restore(); // Restore the state
    }

    // Draw rectangles for the atmospheric layers
    drawRectangle(0, TROPOSPHERE, 'rgba(135, 206, 235, 0.3)', 'Troposphere'); // Troposphere
    drawRectangle(TROPOSPHERE, STRATOSPHERE, 'rgba(70, 130, 180, 0.3)', 'Stratosphere'); // Stratosphere
    drawRectangle(STRATOSPHERE, MESOSPHERE, 'rgba(25, 25, 112, 0.3)', 'Mesosphere'); // Mesosphere
    drawRectangle(MESOSPHERE, THERMOSPHERE, 'rgba(0, 0, 139, 0.3)', 'Thermosphere'); // Thermosphere
  }
};

  
  const drawBoundariesPlugin = {
    id: 'drawBoundaries',
    beforeDraw(chart, args, options) {
      const {ctx, scales, chartArea} = chart;
      const {x, y} = scales;
  
      // Function to draw a boundary line
      function drawBoundaryLine(start, text, labelOffset = 0) {
        const xStart = x.getPixelForValue(start);
        const yTop = y.getPixelForValue(y.max);
        const yBottom = y.getPixelForValue(y.min);

      
        if(start !== 0) {
          // Draw the line
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xStart, yTop);
          ctx.lineTo(xStart, yBottom);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'; // Grey color
          ctx.setLineDash([5, 15]); // Set the line to be dashed
          ctx.stroke();
          ctx.restore();
        }
      
        // Draw the label
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Darker grey color
        ctx.font = '8px Arial'; // Smaller font size
        // Rotated text must fit the plot, not extend into the legend on mobile.
        const labelPadding = 4;
        const availableHeight = chartArea.bottom - chartArea.top - 2 * labelPadding;
        if (availableHeight <= 0) {
          ctx.restore();
          return;
        }
        let textWidth = ctx.measureText(text).width;
        if (textWidth > availableHeight) {
          ctx.font = `${8 * availableHeight / textWidth}px Arial`;
          textWidth = ctx.measureText(text).width;
        }
        const textX = xStart + 10; // Shift the text rightwards
        const textY = Math.max(chartArea.top + labelPadding + textWidth / 2,
          Math.min(yBottom - 80 - labelOffset, chartArea.bottom - labelPadding - textWidth / 2));
        ctx.translate(textX, textY);
        ctx.rotate(-Math.PI / 2); // Rotate the canvas
        ctx.fillText(text, -textWidth / 2, 0);
        ctx.restore();
      }

  
      // Rates are per geopotential km (H); place bases on the geometric z axis.
      // The broad coloured atmosphere bands remain schematic, not model layers.
      LOWER_ATMOSPHERE_LAYERS.forEach(function(layer, index) {
        const z = EARTH_RADIUS_KM * layer.baseHeightKm / (EARTH_RADIUS_KM - layer.baseHeightKm);
        drawBoundaryLine(z, `Lapse: ${layer.lapseRate} °C/km (H)`, (index % 2) * 25);
      });
      drawBoundaryLine(LOWER_ATMOSPHERE_TOP_KM, '86 km: upper reference');
    }
  };

  const markerPlugin = {
  id: 'marker',
  afterDraw(chart, args, options) {
    const { ctx, scales } = chart;
    const { x, y } = scales;
    
    //const altitude = parseFloat(altitudeInput.value);
    const altitude = parseFloat(altitudeSlider.noUiSlider.get());
    const xPosition = x.getPixelForValue(altitude);
    const yPosition = y.getPixelForValue(y.min);  // y-axis min value

    // Draw a marker
    ctx.save();
    ctx.beginPath();
    ctx.arc(xPosition, yPosition + 5, 5, 0, 2 * Math.PI);  // Draw a circle
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw a line from the marker to the x-axis
    ctx.beginPath();
    ctx.moveTo(xPosition, yPosition + 5);
    ctx.lineTo(xPosition, yPosition);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();
  }
};

const referenceMarkersPlugin = {
  id: 'referenceMarkers',
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const { x } = scales;

    ctx.save();
    ALTITUDE_REFERENCES.forEach(function(reference, index) {
      const xPosition = x.getPixelForValue(reference.altitude);
      if (xPosition < chartArea.left || xPosition > chartArea.right) {
        return;
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(xPosition, chartArea.top);
      ctx.lineTo(xPosition, chartArea.bottom);
      ctx.stroke();

      // Use only a small numbered marker on the plot; full labels are below it.
      ctx.setLineDash([]);
      const markerY = chartArea.top + 10 + ((index % 2) * 16);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.arc(xPosition, markerY, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index + 1), xPosition, markerY);
    });
    ctx.restore();
  }
};

chart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: xMax,
        title: {
          display: true,
          text: 'Altitude (km)'
        },
        ticks: {
          callback: function(value) {
            return Number(value).toFixed(0); // Display only integer values on the x-axis
          }
        }
      },
      y: {
        type: isLogarithmic ? 'logarithmic' : 'linear',
        min: yAxisMin,  // Set the minimum y-axis value based on the scale
        // min: 0,  // minimum y-axis value
        max: yAxisMax,  // maximum y-axis value
        title: {
          display: true,
          text: `Air Pressure (${unit.label})`
        },
        beginAtZero: isLogarithmic ? false : true  // Set beginAtZero based on the scale
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const pressure = Number(context.parsed.y).toFixed(unit.decimals);
            return `Air Pressure: ${pressure} ${unit.label}`;
          }
        }
      },
      legend: {
        labels: {
          usePointStyle: true,
          boxWidth: 4
        }
      }
    }
  },
  plugins: [drawRectanglesPlugin, drawBoundariesPlugin, markerPlugin, referenceMarkersPlugin]
});
}
