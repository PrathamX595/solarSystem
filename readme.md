# 3D Solar System

A beautiful, interactive 3D solar system simulation built with Three.js featuring realistic planet textures, orbital mechanics, and post-processing effects.

## Features

- **8 Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune
- **Realistic Textures**: High-quality 2K planet surface textures
- **Saturn's Rings**: Detailed ring system with transparency
- **Interactive Controls**: 
  - Orbit camera controls (mouse drag to rotate, scroll to zoom)
  - Individual planet speed controls via sliders
  - Pause/Resume animation
- **Visual Effects**:
  - Bloom post-processing for atmospheric glow
  - Starfield background
  - Realistic lighting with sun as point light source
- **Tooltips**: Hover over planets to see their names
- **Responsive**: Automatically adjusts to window resize

## Setup and Installation

### Prerequisites

You'll need a local web server to run this project due to CORS restrictions when loading textures and modules.

### Using http-server 


2. **Install http-server globally**:
   ```bash
   npm install -g http-server
   ```

3. **Navigate to the project directory**:
   ```bash
   cd 3jsSolar
   ```

4. **Start the server**:
   ```bash
   http-server . -p 8080
   ```

5. **Open your browser** and go to:
   ```
   http://127.0.0.1:8080/
   ```

## Project Structure

```
3jsSolar/
├── index.html          # Main HTML file
├── main.js             # Three.js application logic
├── readme.md           # This file
└── public/             # Planet texture assets
    ├── 2k_mercury.jpg
    ├── 2k_venus_surface.jpg
    ├── 2k_earth_daymap.jpg
    ├── 2k_mars.jpg
    ├── 2k_jupiter.jpg
    ├── 2k_saturn.jpg
    ├── 2k_saturn_ring_alpha.png
    ├── 2k_uranus.jpg
    └── 2k_neptune.jpg
```

## Usage

### Controls

- **Mouse**: 
  - Left click + drag: Rotate camera around the solar system
  - Scroll wheel: Zoom in/out
  - Right click + drag: Pan camera
- **UI Controls**:
  - **Pause/Resume Button**: Stop or start planet animations
  - **Speed Sliders**: Adjust individual planet orbital speeds
  - **Tooltips**: Hover over planets to see their names

### Customization

You can easily modify the solar system by editing `main.js`:

- **Planet Properties**: Modify the `planetsData` array to change sizes, distances, or speeds
- **Visual Effects**: Adjust bloom parameters in the `bloomPass` configuration
- **Textures**: Replace texture files in the `public/` directory
- **Lighting**: Modify the `sunlight` and `AmbientLight` properties

## Technical Details

### Dependencies

- **Three.js**: 3D graphics library
- **OrbitControls**: Camera controls for interactive navigation
- **EffectComposer**: Post-processing pipeline
- **UnrealBloomPass**: Bloom effect for atmospheric glow

### Key Features Implementation

- **Orbital Mechanics**: Planets follow elliptical paths using trigonometric functions
- **Texture Mapping**: Each planet uses authentic NASA texture maps
- **Saturn's Rings**: Custom ring geometry with UV mapping for realistic appearance
- **Raycasting**: Mouse interaction for planet identification and tooltips
- **Post-Processing**: Bloom effect creates realistic atmospheric glow

## Browser Compatibility

This project works in modern browsers that support:
- WebGL 2.0
- ES6 Modules
- Canvas API

Tested browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

1. **Textures not loading**: Ensure you're running a local server, not opening the HTML file directly
2. **Performance issues**: Try reducing the bloom strength or star count
3. **Controls not working**: Check browser console for JavaScript errors

### Performance Tips

- Use Chrome DevTools to monitor FPS
- Reduce bloom intensity if experiencing lag
- Consider lowering planet geometry detail on slower devices

