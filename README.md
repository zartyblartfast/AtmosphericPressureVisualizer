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

## Atmospheric Model and Tests

`calculatePressure(P0, altitudeKm, seaLevelCelsius)` returns hPa. Entered altitude is **geometric**, from 0 to 100 km inclusive. Up to exactly 86 geometric km it is converted to geopotential height with `H = 6356.766 z / (6356.766 + z)`. The shared data in `constants.js` specifies geopotential boundaries of 0, 11, 20, 32, 47, 51, 71, and 84.852 km and signed gradients of −6.5, 0, +1, +2.8, 0, −2.8, and −2 K/km. Each layer carries its pressure and temperature into the next; hydrostatic integration uses the lapse-layer power law or isothermal exponential with `C = 34.1632 K/km`. The last gradient extends slightly beyond the rounded top to `H(86)`.

From 86–100 geometric km, pressure is `P(86) * exp(F(z) - F(86))`, where `F(z) = 95.571899 - 4.011801*z + 0.06424731*z² - 0.0004789660*z³ + 0.000001340543*z⁴`. Anchoring the reference log-pressure fit at 86 km ensures continuity but can cause small differences from published absolute upper-atmosphere values. Defaults are 1013.25 hPa and 15 °C. Finite positive P0 and finite temperature are required; absolute temperature must stay positive in all traversed lower layers. Invalid inputs return `NaN` without exceptions.

The temperature control offsets the **whole lower temperature profile** and reintegrates pressure, keeping gradients fixed. This is an **educational pressure-response assumption**, not a standard aviation ISA delta-T implementation (which commonly holds pressure fixed while changing density), nor a measured weather forecast. Above 86 km, a temperature offset changes only P(86); the reference upper pressure ratio stays unchanged. No custom upper-temperature model is computed. Humidity, local weather, latitude, and variable upper-atmosphere composition/solar activity are not modelled. Broad coloured chart bands are schematic; lapse annotations show actual shared layer bases in geometric coordinates and rates in °C per geopotential km.

Sources: [U.S. Standard Atmosphere, 1976 (NASA NTRS)](https://ntrs.nasa.gov/citations/19770009539), [ITU-R P.835-6 (2017), Annex 1, equations (1)–(5)](https://www.itu.int/dms_pubrec/itu-r/rec/p/R-REC-P.835-6-201712-S!!PDF-E.pdf), and [PDAS on non-standard atmospheres](https://www.pdas.com/atmosnonstd.html). P.835-6 is superseded and is cited as the equations source, not the latest edition.

Run the model tests without added dependencies or a build step:

```bash
node tests/pressureCalculation.test.mjs
```

The tests use independent reference anchors at lower geopotential and geometric heights and at 90/100 geometric km (upper checks allow 0.1% for fit/normalization differences). They also cover exact sea level, geometric conversion, linear P0 scaling, continuity and monotonicity at true layer boundaries and former breakpoints, positivity over 0–100 km at UI extremes (−50 to +50 °C, 800 to 1100 hPa), invalid inputs, and lower/upper nonstandard-temperature behaviour. These verify numerical behaviour of this model, not forecast accuracy.

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
