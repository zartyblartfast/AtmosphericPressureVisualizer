## Atmospheric Pressure Calculator

The Atmospheric Pressure Calculator is a web application that allows users to visualize and calculate atmospheric pressure at different altitudes. It provides a user-friendly interface for inputting atmospheric variables and generates a visual representation of the atmosphere as a vertical column, along with corresponding pressure values.

## Features

- Calculate atmospheric pressure at a given altitude using the barometric formula.
- Visualize the atmosphere as a vertical column with markers indicating altitude and pressure.
- Interactive form with input fields for atmospheric variables.
- Default values provided for easy initialization.
- Dynamic chart showcasing the relationship between altitude and atmospheric pressure.
- Selectable pressure display units, including hPa, mbar, inHg, kPa, mmHg, psi, atm, Pa, and bar.
- Reference points for Mount Everest, passenger aircraft, weather balloons, and the Kármán line.
- A pressure comparison table for sea level and familiar altitudes.
- Educational explanation of how gravity, air density, and temperature affect atmospheric pressure.
- Responsive design for seamless usage across different devices.

## How to Use

1. Access the Atmospheric Pressure Calculator web page.
2. Input the desired atmospheric variables:
   - **P₀**: Atmospheric pressure at sea level (in hPa).
   - **h**: Altitude above sea level (in kilometers).
   - **T₀**: Standard temperature at sea level (in °C, defaulted by the app).
3. Select the pressure unit you want to display. The app calculates internally in hPa and converts the output and chart to the selected unit.
4. The web application will calculate the atmospheric pressure at the given altitude and update the visual representation.
5. Use the altitude reference points below the chart to jump to familiar altitudes. The chart uses subtle numbered guide lines to avoid clutter.
6. The calculated pressure value and its percentage of sea-level pressure will be displayed in the Output section.
7. Use the comparison table below the reference points to compare calculated pressures at familiar altitudes.
8. Additionally, a dynamic chart will showcase the relationship between altitude and atmospheric pressure.
9. Expand **The Science Behind Atmospheric Pressure** for an explanation of gravity, the weight of the air column, and atmospheric layers.
10. Explore different inputs to observe the variations in atmospheric pressure.

## Technologies Used

- HTML
- CSS
- JavaScript

## Deployment

The Atmospheric Pressure Visualizer can be accessed at its configured GitHub Pages custom domain:

[Atmospheric Pressure Visualizer](https://atmosphericpressurevisualizer.com/)

To deploy the application locally, clone this repository, start a local web server from the repository root, and open `http://127.0.0.1:8008/index.html`:

```bash
python -m http.server 8008
```

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue in this repository. Pull requests for improvements are also encouraged.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- The barometric formula used for calculating atmospheric pressure is based on scientific principles and equations.
- Inspiration for this project came from the curiosity to explore the relationship between altitude and atmospheric pressure.
