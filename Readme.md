# Our Journey Through The Stars - An Interactive 3D Experience

## Table of Contents (Clickable)

- [Our Journey Through The Stars - An Interactive 3D Experience](#our-journey-through-the-stars---an-interactive-3d-experience)
  - [Table of Contents (Clickable)](#table-of-contents-clickable)
  - [1. Introduction](#1-introduction)
  - [2. Features](#2-features)
  - [3. Project Setup](#3-project-setup)
    - [3.1. Prerequisites](#31-prerequisites)
    - [3.2. Installation](#32-installation)
    - [3.3. Running the Project](#33-running-the-project)
  - [4. File \& Directory Structure](#4-file--directory-structure)
  - [5. Technologies Used](#5-technologies-used)
  - [6. CSS Styling (`style-3d.css`) - Overview](#6-css-styling-style-3dcss---overview)
    - [6.1. General Setup](#61-general-setup)
    - [6.2. Overlays (Intro, Point Info)](#62-overlays-intro-point-info)
    - [6.3. Fixed UI Elements (Age Display, Stats Tooltip)](#63-fixed-ui-elements-age-display-stats-tooltip)
    - [6.4. Responsive Design](#64-responsive-design)
  - [7. JavaScript Logic (`script-3d.js`) - Part 1: Core Setup \& Configuration](#7-javascript-logic-script-3djs---part-1-core-setup--configuration)
    - [7.1. Global Variables \& Constants](#71-global-variables--constants)
    - [7.2. DOM Element Selection](#72-dom-element-selection)
    - [7.3. Story Data Structure](#73-story-data-structure)
    - [7.4. Initialization (`init`)](#74-initialization-init)
    - [7.5. Asset Loading (Textures, Font)](#75-asset-loading-textures-font)
    - [7.6. Event Listeners](#76-event-listeners)
    - [7.7. Animation Loop (`animate`)](#77-animation-loop-animate)
  - [8. JavaScript Logic (`script-3d.js`) - Part 2: Scene Object Creation](#8-javascript-logic-script-3djs---part-2-scene-object-creation)
    - [Function List (Part 2)](#function-list-part-2)
    - [Function Details (Part 2)](#function-details-part-2)
      - [`createStoryPoints()`](#createstorypoints)
      - [`createPathTexts()`](#createpathtexts)
      - [`createDistantStars(starCount = 5000, radius = 1500, starSize = 0.8)`](#createdistantstarsstarcount--5000-radius--1500-starsize--08)
      - [`createParallaxStars(densityMultiplier = 1.0, spreadRadius = 0.1, starSize = 1.0, padding = 40)`](#createparallaxstarsdensitymultiplier--10-spreadradius--01-starsize--10-padding--40)
      - [`createCameraPath()`](#createcamerapath)
      - [`createCurveVisualization()` *(Debug function)*](#createcurvevisualization-debug-function)
      - [`createGalaxyBackground()` *(Potentially deprecated/replaced)*](#creategalaxybackground-potentially-deprecatedreplaced)
  - [9. JavaScript Logic (`script-3d.js`) - Part 3: Interaction, Updates \& Effects](#9-javascript-logic-script-3djs---part-3-interaction-updates--effects)
    - [Function List (Part 3)](#function-list-part-3)
    - [Function Details (Part 3)](#function-details-part-3)
      - [Update Loop \& Core Updates](#update-loop--core-updates)
        - [`animate()`](#animate)
        - [`updateCamera()`](#updatecamera)
        - [`updatePathTextOpacity()`](#updatepathtextopacity)
        - [`updateAgeBasedOnProgress()`](#updateagebasedonprogress)
      - [Interaction Handlers](#interaction-handlers)
        - [`handleIntro()`](#handleintro)
        - [`startExperience()`](#startexperience)
        - [`handleMouseMove(event)`](#handlemousemoveevent)
        - [`handleMouseWheel(event)`](#handlemousewheelevent)
        - [`handleBackgroundClick(event)`](#handlebackgroundclickevent)
        - [`checkIntersections()`](#checkintersections)
        - [`focusOnStar(targetStar)` *(If implemented)*](#focusonstartargetstar-if-implemented)
      - [Effects \& Animations](#effects--animations)
        - [`spawnShootingStar()`](#spawnshootingstar)
        - [`spawnAfterimage(position, startScale, startOpacity)` *(Helper for shooting stars)*](#spawnafterimageposition-startscale-startopacity-helper-for-shooting-stars)
        - [`scheduleNextShootingStar()`](#schedulenextshootingstar)
        - [`startPulsingAnimation()`](#startpulsinganimation)
      - [UI \& Helper Functions](#ui--helper-functions)
        - [`setupStatsUI()`](#setupstatsui)
        - [`getPointDataAtProgress(progress)`](#getpointdataatprogressprogress)
        - [`calculateAge(targetDate)`](#calculateagetargetdate)
        - [`calculateStats(daysOld)`](#calculatestatsdaysold)
        - [`formatNumber(num)`](#formatnumbernum)
        - [`parseApproxDate(dateStr)`](#parseapproxdatedatestr)
        - [`onWindowResize()`](#onwindowresize)
  - [10. Future Enhancements \& Ideas](#10-future-enhancements--ideas)
  - [11. Customization Notes](#11-customization-notes)
  - [12. Credits \& Acknowledgements](#12-credits--acknowledgements)

*(Note: The links to JavaScript function details will be completed in subsequent parts of this README.)*

---

## 1. Introduction

"Our Journey Through The Stars" is an interactive 3D web experience designed to tell a personal story through a visually engaging "flight" through a galaxy. Key life moments are represented as stars, and the user navigates this timeline using the mouse wheel. The project utilizes Three.js for 3D rendering and Anime.js for UI and transition animations.

This experience is intended as a heartfelt and unique way to reminisce and celebrate a personal journey, specifically tailored for Akanksha.

---

## 2. Features

*   **3D Space Navigation:** Smooth camera movement along a predefined path controlled by mouse wheel scrolling.
*   **Interactive Story Points:** "Stars" representing key life events, which display details (title, date, note, image) on hover.
*   **Dynamic Background:**
    *   **Distant Starfield:** A far-off, slowly rotating sphere of stars providing a constant backdrop.
    *   **Parallax Stars:** A closer layer of stars distributed along the camera's path, creating a sense of depth and motion as the user travels.
*   **Floating Text:** Contextual words or phrases appear between story points, fading in as the camera approaches.
*   **Shooting Stars:** Randomly generated shooting stars with trails animate across the scene for added visual interest.
*   **Pulsing Special Stars:** Certain significant story points have a subtle pulsing glow effect.
*   **Intro Overlay:** A welcoming screen with a message that can be customized (e.g., for a birthday).
*   **Dynamic Age Display:** Shows the calculated age corresponding to the current point in the journey.
*   **Stats Tooltip:** Displays lifetime statistics (heartbeats, breaths, moon orbits) when hovering over the age display.
*   **Responsive UI Elements:** Overlays and information pop-ups are designed to work across different screen sizes.

---

## 3. Project Setup

### 3.1. Prerequisites

*   A modern web browser with WebGL support (Chrome, Firefox, Edge, Safari).
*   A local web server to serve the files (due to browser security restrictions on loading local files like textures and fonts directly via `file:///`).
    *   Common choices:
        *   Visual Studio Code with the "Live Server" extension.
        *   Python's built-in HTTP server (`python -m http.server`).
        *   Node.js with a simple server package like `http-server` (`npm install -g http-server` then run `http-server`).

### 3.2. Installation

1.  **Download or Clone the Project:**
    *   If you have a ZIP file, extract it to a new folder.
    *   If it's a Git repository, clone it: `git clone <repository-url>`
2.  **Place Assets:**
    *   Ensure you have an `images/` folder containing:
        *   `star-glow.png` (for story points and shooting stars)
        *   `background-star-dot.png` (for both parallax and distant background stars)
        *   All placeholder images (`placeholder1.png`, `placeholder2.png`, etc.) or your actual story images.
    *   Ensure you have a `fonts/` folder containing the typeface JSON font file (e.g., `Orbitron_ExtraBold.json` or `helvetiker_regular.typeface.json`). The path in `script-3d.js` must match this location.

### 3.3. Running the Project

1.  Navigate to the project's root directory in your terminal or command prompt.
2.  Start your local web server. Examples:
    *   **VS Code Live Server:** Right-click `index.html` and select "Open with Live Server".
    *   **Python:** `python -m http.server 8000` (or any available port). Then open `http://localhost:8000` in your browser.
    *   **http-server (Node.js):** `http-server`. It will typically tell you the address (e.g., `http://127.0.0.1:8080`).
3.  Open the provided URL in your web browser.

---

## 4. File & Directory Structure
Use code with caution.
Markdown
project-root/
├── index.html # Main HTML file
├── script-3d.js # Core JavaScript logic for the 3D experience
├── style-3d.css # CSS for UI overlays and general styling
├── images/ # Directory for all image assets
│ ├── star-glow.png
│ ├── background-star-dot.png
│ ├── placeholder1.png
│ └── ... (other story images)
├── fonts/ # Directory for typeface JSON fonts
│ └── Orbitron_ExtraBold.json # (or your chosen font file)
└── README.md # This documentation file

---

## 5. Technologies Used

*   **HTML5:** Structure of the web page.
*   **CSS3:** Styling for UI elements and overlays.
*   **JavaScript (ES6+):** Core application logic.
*   **Three.js (r128):** A 3D graphics library for creating and displaying animated 3D computer graphics in a web browser using WebGL.
*   **Anime.js (v3.2.1):** A lightweight JavaScript animation library for animating CSS properties, SVG, DOM attributes, and JavaScript Objects. Used here for UI transitions and some object animations.

---
---

## 6. CSS Styling (`style-3d.css`) - Overview

The `style-3d.css` file is responsible for the visual appearance of all non-WebGL elements, such as UI overlays, text displays, and buttons.

### 6.1. General Setup

*   **`body`:** Basic reset (margin, overflow hidden), default background color (dark), text color, and primary font family.
*   **`#three-canvas`:** Ensures the canvas element used by Three.js fills the entire viewport and is positioned behind UI overlays.

### 6.2. Overlays (Intro, Point Info)

*   **`.overlay` (Base Class):**
    *   Fixed position, full width/height, centered content.
    *   Semi-transparent background for a "dimmed" effect over the 3D scene.
    *   Smooth `opacity` transition for fade-in/out effects.
    *   The `.hidden` class is used to hide overlays.
*   **`.overlay-content`:** Styles the inner content box of overlays (padding, background, border-radius, max-width).
*   **`#intro-overlay`:** Specific styles for the initial welcome/birthday message overlay.
    *   Includes styling for a placeholder "man looking at sky" visual, which can be replaced with an actual image.
    *   Uses a `data-is-birthday="true"` attribute (set by JavaScript) to potentially apply different styling on birthdays (e.g., a different background tint).
*   **`#point-info-overlay`:** Styles the pop-up that appears when hovering over a story point star.
    *   Fixed position (dynamically set by JavaScript to follow the mouse).
    *   Styled to look like an information card with a title, date, image, and note.
    *   Smooth `opacity` and `transform` transitions for appearance.

### 6.3. Fixed UI Elements (Age Display, Stats Tooltip)

*   **`#age-display-container`:** Styles the fixed element in the top-left corner that shows the current calculated age based on journey progress.
    *   Semi-transparent background, rounded corners.
*   **`#stats-tooltip`:** Styles the tooltip that appears when hovering over the age display, showing lifetime statistics.
    *   Positioned below the age display.
    *   Similar card-like styling to the point info overlay.
    *   Uses a `.visible` class (toggled by JavaScript) for display.

### 6.4. Responsive Design

*   Includes basic `@media` queries (e.g., for `max-width: 600px`) to adjust padding, font sizes, and element widths for smaller screens, ensuring a better experience on mobile devices.

---

## 7. JavaScript Logic (`script-3d.js`) - Part 1: Core Setup & Configuration

The `script-3d.js` file orchestrates the entire 3D experience. This section details the initial setup and configuration aspects.

*(Note: Specific functions will be detailed further in subsequent parts. Links below will point to those detailed descriptions once fully generated.)*

### 7.1. Global Variables & Constants

The script begins by declaring numerous global variables and constants that are used throughout the application.

*   **`THREE`:** Alias for `window.THREE`, assuming Three.js is loaded globally.
*   **Configuration Constants:**
    *   `BIRTH_DATE_STR`, `BIRTH_DATE`: For age and stats calculations.
    *   `AVG_HEARTBEATS_PER_MINUTE`, `AVG_BREATHS_PER_MINUTE`, `AVG_MOON_ORBIT_DAYS`: For lifetime stats calculations.
    *   `STORY_POINT_COUNT`: The total number of story points.
    *   `HER_BIRTHDAY_MONTH`, `HER_BIRTHDAY_DAY`: For the birthday-specific intro message.
    *   `STAR_IMAGE_PATH`, `BACKGROUND_STAR_PATH`, `FONT_PATH`: Paths to asset files.
*   **Three.js Core Objects:** `scene`, `camera`, `renderer`.
*   **Scene Elements:**
    *   `storyPoints3D`: Array to hold interactive story point objects (sprites or meshes).
    *   `cameraPathCurve`: The Three.js `CatmullRomCurve3` object defining the camera's flight path.
    *   `cosmicEventsGroup`: A `THREE.Group` for managing shooting stars.
    *   `pathTextGroup`: A `THREE.Group` for managing floating text objects.
    *   `distantStars`, `parallaxStars`: `THREE.Points` objects for the two background star layers.
    *   `pulsingStars`: Array holding references to special story point meshes that pulse.
    *   `pathTubeObject`: (If path visualization is implemented) Holds the tube mesh.
    *   `curveVisualizationObject`: (For debugging) Holds the red line visualizing the path.
*   **Camera & Navigation State:** `cameraPathProgress`, `targetPathProgress`, `scrollSpeed`.
*   **Loaded Assets:** `starTexture`, `backgroundStarTexture`, `loadedFont`.
*   **Interaction:** `raycaster`, `mouse`, `intersectedObject`, `isFocusing`, `currentFocusAnimation`.
*   **UI State:** `shootingStarTimeoutId`.

### 7.2. DOM Element Selection

Variables are declared to hold references to key HTML elements obtained using `document.getElementById()`. These are used for updating UI content and managing overlay visibility.
*   Examples: `canvas`, `introOverlay`, `recallButton`, `pointInfoOverlay`, `currentAgeSpan`, etc.

### 7.3. Story Data Structure

*   **`storyData` (Array of Objects):** This is the central data source for the narrative. Each object in the array represents a story point (a star) and typically contains:
    *   `date` (String): The date of the event.
    *   `title` (String): A short title for the event.
    *   `note` (String): A descriptive note or memory.
    *   `image` (String): Filename of the associated image (e.g., "placeholder1.png").
    *   `position` (Array `[x, y, z]`): The 3D coordinates for this star in the scene. These points define the camera's flight path.
    *   `textBefore` (String, Optional): Text that floats in space before this star.
    *   `special` (Boolean, Optional): Flag to mark a star as special (e.g., for pulsing).
    *   `id` (String, Optional): A unique identifier (e.g., "mom-star").
    *   `isEnd` (Boolean, Optional): Marks the final point, potentially for special handling.

### 7.4. Initialization (`init`)

*   [Function: `init`](#function-init)
*   This is the main function called once the DOM is loaded. It sets up the entire 3D scene and application state.
*   **Responsibilities:**
    1.  Creates the Three.js `Scene`, `PerspectiveCamera`, and `WebGLRenderer`.
    2.  Configures renderer size, pixel ratio, and clear color.
    3.  Adds lighting (`AmbientLight`, `DirectionalLight`) to the scene.
    4.  Creates `THREE.Group` objects for organizing scene elements (`cosmicEventsGroup`, `pathTextGroup`).
    5.  Initiates loading of essential assets:
        *   **Font:** Uses `THREE.FontLoader` to load the typeface JSON font required for 3D text. Calls `createPathTexts` in its `onLoad` callback.
        *   **Textures:** Uses `THREE.TextureLoader` to load:
            *   `starTexture` (for story points/shooting stars). Calls `createStoryPoints` in its `onLoad` callback.
            *   `backgroundStarTexture` (for background layers). Calls `createDistantStars` and `createParallaxStars` in its `onLoad` callback.
    6.  Calls `createCameraPath()` to generate the CatmullRom curve from `storyData`.
    7.  (If debugging) Calls `createCurveVisualization()` after the path is created.
    8.  Initializes interaction objects (`Raycaster`, `mouse` vector).
    9.  Calls `setupStatsUI()` to prepare the age display and tooltip.
    10. Calls `handleIntro()` to manage the initial overlay message and start the animation loop.
    11. Attaches all necessary event listeners (resize, mousemove, wheel, button clicks).

### 7.5. Asset Loading (Textures, Font)

*   Asset loading is asynchronous. The `init` function uses callbacks (`onLoad`) within the `FontLoader` and `TextureLoader` to ensure that functions dependent on these assets (like `createPathTexts`, `createStoryPoints`, `createDistantStars`, `createParallaxStars`) are only called *after* the respective assets have finished loading. This prevents errors from trying to use unready resources.

### 7.6. Event Listeners

The `init` function attaches several event listeners to the `window` or specific DOM elements:
*   `window.addEventListener('resize', onWindowResize)`: Handles browser window resizing to keep the 3D scene correctly proportioned.
*   `window.addEventListener('mousemove', handleMouseMove)`: Tracks mouse position for raycasting (hover effects) and positioning info overlays.
*   `window.addEventListener('wheel', handleMouseWheel, { passive: false })`: Manages scrolling along the camera path and prevents default page scroll.
*   `recallButton.addEventListener('click', startExperience)`: Starts the main experience when the intro button is clicked.
*   `canvas.addEventListener('click', handleBackgroundClick)`: Handles clicks on the canvas, used for focusing on stars or potentially triggering effects.

### 7.7. Animation Loop (`animate`)

*   [Function: `animate`](#function-animate)
*   This function is the heart of the rendering process. It's set up using `requestAnimationFrame` to create a smooth animation loop synchronized with the browser's refresh rate.
*   **Responsibilities (per frame):**
    1.  Calls `updatePathTextOpacity()` to adjust visibility of floating text.
    2.  Calls `updateCamera()` to:
        *   Update the camera's position and look-at point based on scroll progress along `cameraPathCurve` (if not focusing on a star).
        *   Apply slow rotation to the `distantStars` and `parallaxStars` layers.
    3.  If the intro is hidden:
        *   Calls `checkIntersections()` for story point hover effects.
        *   Calls `updateAgeBasedOnProgress()` for the UI.
    4.  Calls `renderer.render(scene, camera)` to draw the current state of the scene from the camera's perspective.

---
---

## 8. JavaScript Logic (`script-3d.js`) - Part 2: Scene Object Creation

This section details the functions responsible for creating the visual elements within the 3D scene, such as the story point stars, background starfields, and floating text. These functions are typically called during the `init` phase, often within asset loader callbacks to ensure resources like textures and fonts are ready.

### Function List (Part 2)

*   [`createStoryPoints()`](#function-createstorypoints)
*   [`createPathTexts()`](#function-createpathtexts)
*   [`createDistantStars()`](#function-createdistantstars)
*   [`createParallaxStars()`](#function-createparallaxstars)
*   [`createCameraPath()`](#function-createcamerapath)
*   [`createCurveVisualization()`](#function-createcurvevisualization) *(Debug function)*
*   [`createGalaxyBackground()`](#function-creategalaxybackground) *(Potentially deprecated/replaced)*

---

### Function Details (Part 2)

#### <a name="function-createstorypoints"></a>`createStoryPoints()`

*   **Purpose:** Populates the scene with interactive "story point" objects based on the `storyData` array. These represent the key moments in the journey.
*   **Process:**
    1.  **Prerequisites:** Checks if the `starTexture` (for the star images) has been loaded.
    2.  **Cleanup:** Removes any previously created story point objects from the scene and disposes of their geometries and materials. Resets the `storyPoints3D` and `pulsingStars` arrays.
    3.  **Geometry (for Special Stars):** Defines a `THREE.PlaneGeometry` to be used for special, pulsing stars (which are rendered as textured meshes rather than sprites).
    4.  **Iteration:** Loops through each entry in the `storyData` array.
    5.  **Conditional Creation:**
        *   **Special Stars:** If an entry is marked as `special: true` or has a specific `id` (e.g., "mom-star"):
            *   A `THREE.MeshPhongMaterial` is created. This material supports emissive properties for glowing. It's configured with the `starTexture`, a base color, an emissive color, and an initial `emissiveIntensity`. Transparency and additive blending are used for the glow effect.
            *   A `THREE.Mesh` is created using the `planeGeometry` and the `phongMaterial`.
            *   This mesh is added to the `pulsingStars` array for later animation.
        *   **Regular Stars:** For non-special points:
            *   A `THREE.SpriteMaterial` is created, using the `starTexture`. It's configured for transparency, a default color, and additive blending.
            *   A `THREE.Sprite` is created. Sprites are 2D planes that always face the camera.
            *   The sprite's scale is set.
    6.  **Common Properties:** For both types of point objects:
        *   The `position` is set based on the coordinates in `storyData`.
        *   `userData` is populated with relevant information from `storyData` (title, date, note, image path, etc.), along with flags like `isStoryPoint` and `isSpecial`. This data is used for hover interactions and other logic.
        *   The object is added to the `storyPoints3D` array (for raycasting intersections) and directly to the `scene`.
    7.  **Animation Trigger:** After all points are created, it calls `startPulsingAnimation()` to begin the glow effect for special stars.

#### <a name="function-createpathtexts"></a>`createPathTexts()`

*   **Purpose:** Creates and positions 3D text objects that float in space between story points, providing contextual words or phrases.
*   **Process:**
    1.  **Prerequisites:** Checks if the `loadedFont` (typeface JSON) and `storyData` are available.
    2.  **Cleanup:** Removes any previously created text objects from the `pathTextGroup` and disposes of their resources. Resets the `pathTexts3D` array.
    3.  **Parameters:** Defines constants for text appearance (size, height/depth, color, vertical offset from the path, interpolation factor for placement between stars).
    4.  **Iteration:** Loops through `storyData` starting from the *second* point (index `i=1`), as text is placed *before* each point, relative to the previous one.
    5.  **Text Content Check:** For each point, it checks if `currentPointData.textBefore` exists and is a non-empty string.
    6.  **Position Calculation:**
        *   Gets the 3D positions of the current story point (`pos2`) and the previous one (`pos1`).
        *   Calculates the `textPosition` by interpolating between `pos1` and `pos2` using `textInterpolationFactor`. A factor of 0.35 places it closer to the previous star.
        *   Applies a `textYOffset` to slightly raise the text.
    7.  **`THREE.TextGeometry` Creation:** Generates the 3D geometry for the text using the `loadedFont`, the `textContent`, and parameters like `size` and `height`.
    8.  **Geometry Centering:** Calls `textGeometry.center()` to ensure the mesh's origin is at the visual center of the text, simplifying positioning and rotation.
    9.  **Material Creation:** Creates a `THREE.MeshBasicMaterial` for the text. It's set to be transparent with an initial `opacity` of 0 (the text starts invisible).
    10. **Mesh Creation & Positioning:** Creates the `THREE.Mesh` and sets its `position`.
    11. **Orientation (Optional `lookAt`):** (Currently commented out for debugging) Code to make the text face "forward" along the path segment by calculating a look-at target slightly ahead of the text's position.
    12. **`userData`:** Stores a flag `isPathText` and an ID.
    13. **Scene Management:** Adds the text mesh to the `pathTexts3D` array and to the `pathTextGroup` (or directly to the scene if the group isn't used).

#### <a name="function-createdistantstars"></a>`createDistantStars(starCount = 5000, radius = 1500, starSize = 0.8)`

*   **Purpose:** Creates a very large, sparse sphere of stars that serves as the far-off, static background, ensuring stars are always visible.
*   **Parameters:**
    *   `starCount`: Number of stars in this layer (default: 5000).
    *   `radius`: Radius of the sphere in which stars are distributed (default: 1500 units).
    *   `starSize`: Visual size of these distant star points (default: 0.8).
*   **Process:**
    1.  **Prerequisites:** Checks if `backgroundStarTexture` is loaded.
    2.  **Cleanup:** Removes and disposes of any previous `distantStars` object.
    3.  **Positions & Colors:** Initializes arrays for star positions and colors. Uses a slightly dimmer/different `baseColor` than other star layers for differentiation.
    4.  **Spherical Distribution:** Loops `starCount` times. For each star:
        *   Calculates random `phi` (latitude) and `theta` (longitude).
        *   Calculates a random radius `r` *within* the specified large `radius` (i.e., `Math.random() * radius`), so stars are distributed throughout the volume, not just on the surface.
        *   Converts spherical coordinates to Cartesian (x, y, z) and stores them.
        *   Assigns a slightly varied color.
    5.  **Geometry:** Creates `THREE.BufferGeometry` and sets the `position` and `color` attributes.
    6.  **Material:** Creates a `THREE.PointsMaterial` using the `backgroundStarTexture`, the specified `starSize`, and appropriate transparency/blending settings (`AdditiveBlending`, `depthWrite: false`).
    7.  **Points Object:** Creates the `THREE.Points` object and assigns it to the global `distantStars` variable.
    8.  **`renderOrder = -2`:** Sets the lowest render order, ensuring these stars are drawn first (behind everything else).
    9.  **Add to Scene:** Adds the `distantStars` object to the scene. It remains static at the world origin.

#### <a name="function-createparallaxstars"></a>`createParallaxStars(densityMultiplier = 1.0, spreadRadius = 0.1, starSize = 1.0, padding = 40)`

*   **Purpose:** Creates a layer of stars distributed along and around the actual `cameraPathCurve`. These stars remain static in world space, and as the camera moves past them, they create a parallax effect, enhancing the sense of depth and motion.
*   **Parameters (with current debug values):**
    *   `densityMultiplier`: Scales how many stars are generated relative to the curve's segments (default: 1.0).
    *   `spreadRadius`: How far stars are randomly offset perpendicularly from the curve (default debug: 0.1 - very small).
    *   `starSize`: Visual size of these parallax star points (default: 1.0).
    *   `padding`: How far to extend the star field before the curve's start and after its end (default: 40 units).
*   **Process (using Frenet Frames Iteration):**
    1.  **Prerequisites:** Checks if `cameraPathCurve` and `backgroundStarTexture` are available.
    2.  **Cleanup:** Removes and disposes of any previous `parallaxStars` object.
    3.  **Frenet Frames Calculation:** Calls `cameraPathCurve.computeFrenetFrames()` to get an array of points, tangents, normals, and binormals along the curve. The number of `curveSegments` for this calculation is determined based on the curve's length.
    4.  **Star Generation Loop:**
        *   Determines the `numStarsToGenerate` based on the number of calculated frames and the `densityMultiplier`.
        *   Loops this many times, picking a *random frame index* for each star.
        *   Retrieves the `pointOnCurve`, `normal`, and `binormal` from the pre-calculated `frames` at that index.
        *   Calls a helper sub-function (`generateStarWithOffset`) to:
            *   Calculate a random offset within a circle defined by `spreadRadius`, using the `normal` and `binormal` of the frame as the plane.
            *   Add this offset to the `pointOnCurve` to get the final star position.
            *   Store the position and a slightly varied color.
    5.  **Padding Generation:** Generates additional stars "before" the start of the curve and "after" the end of the curve, using the `padding` distance and the Frenet frame information (tangent, normal, binormal) at the curve's start and end points.
    6.  **Geometry & Material:** Creates `THREE.BufferGeometry` from the generated positions and colors. Creates a `THREE.PointsMaterial` similar to `distantStars` but using the specific `starSize` for this layer.
    7.  **Points Object:** Creates the `THREE.Points` object, assigns it to `parallaxStars`.
    8.  **`renderOrder = -1`:** Sets render order so these draw on top of `distantStars` but behind story points/text.
    9.  **Add to Scene:** Adds `parallaxStars` to the scene. It remains static at the world origin.

#### <a name="function-createcamerapath"></a>`createCameraPath()`

*   **Purpose:** Generates the smooth 3D curve (`THREE.CatmullRomCurve3`) that the camera follows during the journey.
*   **Process:**
    1.  Maps the `storyData` array to extract just the `position` arrays.
    2.  Converts each `position` array into a `THREE.Vector3` object.
    3.  If there are fewer than two points, logs an error and creates a simple default curve to prevent further errors.
    4.  Creates a `THREE.CatmullRomCurve3` object using the array of `Vector3` points.
        *   `closed` is set to `false`.
        *   `curveType` is 'catmullrom' (default, good for smooth interpolation).
        *   `tension` is set (e.g., 0.5 default), controlling the "tightness" of the curve.
    5.  Assigns the generated curve to the global `cameraPathCurve` variable.

#### <a name="function-createcurvevisualization"></a>`createCurveVisualization()` *(Debug function)*

*   **Purpose:** (For debugging) Renders the `cameraPathCurve` as a visible line in the scene to help verify its shape and alignment with other elements.
*   **Process:**
    1.  Checks if `cameraPathCurve` exists.
    2.  Removes any previous visualization object.
    3.  Calls `cameraPathCurve.getPoints(200)` to get a series of 200 points along the curve.
    4.  Creates a `THREE.BufferGeometry` from these points.
    5.  Creates a `THREE.LineBasicMaterial` (e.g., bright red).
    6.  Creates a `THREE.Line` object using the geometry and material.
    7.  Adds the line object to the scene and stores it in `curveVisualizationObject`.

#### <a name="function-creategalaxybackground"></a>`createGalaxyBackground()` *(Potentially deprecated/replaced)*

*   **Purpose:** (Original function for background stars, now largely replaced by `createDistantStars` and `createParallaxStars`). Creates a single, large spherical distribution of star points.
*   **Process (if still used or as reference):**
    1.  Cleans up previous `galaxyParticles`.
    2.  Generates random spherical coordinates for `starCount` points within a specified `radiusSpread` and `baseRadius`.
    3.  Creates `THREE.BufferGeometry` and `THREE.PointsMaterial` (potentially using `backgroundStarTexture`).
    4.  Creates the `THREE.Points` object and assigns it to `galaxyParticles`.
    5.  Sets `renderOrder` on the `galaxyParticles` object.
    6.  Adds `galaxyParticles` to the scene.
    *   **Note:** If this function is still being called alongside the new `createDistantStars` and `createParallaxStars`, it can lead to an unwanted third layer of stars and potential confusion or errors if `galaxyParticles` is referenced elsewhere (e.g., in `updateCamera`). It should generally be removed if the two-layer system is active.

---
---

## 9. JavaScript Logic (`script-3d.js`) - Part 3: Interaction, Updates & Effects

This section describes the functions that handle user input, update the scene dynamically each frame, and manage visual effects like the intro sequence, shooting stars, and pulsing glows.

### Function List (Part 3)

*   **Update Loop & Core Updates:**
    *   [`animate()`](#function-animate) *(Already covered in Part 1, reiterated here for context)*
    *   [`updateCamera()`](#function-updatecamera)
    *   [`updatePathTextOpacity()`](#function-updatepathtextopacity)
    *   [`updateAgeBasedOnProgress()`](#function-updateagebasedonprogress)
*   **Interaction Handlers:**
    *   [`handleIntro()`](#function-handleintro)
    *   [`startExperience()`](#function-startexperience)
    *   [`handleMouseMove()`](#function-handlemousemove)
    *   [`handleMouseWheel()`](#function-handlemousewheel)
    *   [`handleBackgroundClick()`](#function-handlebackgroundclick)
    *   [`checkIntersections()`](#function-checkintersections)
    *   [`focusOnStar()`](#function-focusonstar) *(If implemented)*
*   **Effects & Animations:**
    *   [`spawnShootingStar()`](#function-spawnshootingstar)
    *   [`spawnAfterimage()`](#function-spawnafterimage) *(Helper for shooting stars)*
    *   [`scheduleNextShootingStar()`](#function-schedulenextshootingstar)
    *   [`startPulsingAnimation()`](#function-startpulsinganimation)
*   **UI & Helper Functions:**
    *   [`setupStatsUI()`](#function-setupstatsui)
    *   [`getPointDataAtProgress()`](#function-getpointdataatprogress)
    *   [`calculateAge()`](#function-calculateage)
    *   [`calculateStats()`](#function-calculatestats)
    *   [`formatNumber()`](#function-formatnumber)
    *   [`parseApproxDate()`](#function-parseapproxdate)
    *   [`onWindowResize()`](#function-onwindowresize)

---

### Function Details (Part 3)

#### Update Loop & Core Updates

##### <a name="function-animate"></a>`animate()`

*   **(Reiteration from Part 1)** This function forms the core rendering loop using `requestAnimationFrame`.
*   **Per Frame:**
    1.  Calls `updatePathTextOpacity()` to manage floating text visibility.
    2.  Calls `updateCamera()` to position the camera along its path and rotate background star layers.
    3.  If the intro is hidden, it calls:
        *   `checkIntersections()` for hover effects on story points.
        *   `updateAgeBasedOnProgress()` to update the age display UI.
    4.  Finally, `renderer.render(scene, camera)` draws the scene.

##### <a name="function-updatecamera"></a>`updateCamera()`

*   **Purpose:** Updates the camera's position and orientation based on the `cameraPathProgress` (controlled by the scroll wheel) and applies independent rotation to background star layers.
*   **Process:**
    1.  Checks if a "focus on star" animation is active (e.g., `window.isFocusing`). If so, it might return early or only apply background rotations.
    2.  If the intro is hidden and `cameraPathCurve` exists:
        *   Smoothly interpolates `cameraPathProgress` towards `targetPathProgress`.
        *   Clamps `cameraPathProgress` between 0 and 1.
        *   Gets the current `position` on the `cameraPathCurve` using `getPointAt(cameraPathProgress)`.
        *   Gets a `lookAtPoint` slightly ahead on the curve.
        *   Sets `camera.position` and makes the camera `lookAt(lookAtPoint)`.
    3.  **Independent Background Rotation:**
        *   If `distantStars` exists, applies a very slow rotation to its `y` and `x` axes.
        *   If `parallaxStars` exists, applies an optional slow rotation (can be different or none).
    *   **Note:** This function ensures that background star layers (`distantStars`, `parallaxStars`) remain static in world space, allowing the camera to fly past them, creating parallax.

##### <a name="function-updatepathtextopacity"></a>`updatePathTextOpacity()`

*   **Purpose:** Dynamically adjusts the opacity of floating text objects (`pathTexts3D`) based on their proximity to the camera.
*   **Process:**
    1.  Checks if `pathTexts3D` and `camera` exist.
    2.  Defines parameters: `fadeInStartDistance`, `fullOpacityDistance`, `opacityTransitionSpeed`.
    3.  Iterates through each `textMesh` in `pathTexts3D`:
        *   Calculates the `distance` from the camera to the text mesh.
        *   Determines a `targetOpacity`: 1.0 if within `fullOpacityDistance`, 0.0 if beyond `fadeInStartDistance`, and interpolated linearly in between.
        *   Smoothly transitions the `textMesh.material.opacity` from its current value towards the `targetOpacity` using `opacityTransitionSpeed`.

##### <a name="function-updateagebasedonprogress"></a>`updateAgeBasedOnProgress()`

*   **Purpose:** Updates the age display (`currentAgeSpan`) in the UI to reflect the approximate age at the camera's current position along the journey.
*   **Process:**
    1.  If the intro is hidden:
        *   Calls `getPointDataAtProgress(cameraPathProgress)` to find the `storyData` entry closest to the current camera progress.
        *   If a valid point is found, it calls `parseApproxDate()` on its `date` string.
        *   Determines the `displayDate` (either the parsed event date or today's date if the event is in the future or unparsable).
        *   Calls `calculateAge(displayDate)` using the `BIRTH_DATE`.
        *   Updates the `textContent` of `currentAgeSpan` with the formatted age (years, months, days).
    2.  If the intro is visible, it sets the age display to "0y 0m 0d".

#### Interaction Handlers

##### <a name="function-handleintro"></a>`handleIntro()`

*   **Purpose:** Manages the initial intro overlay, displaying a standard or birthday-specific message.
*   **Process:**
    1.  Checks if it's "her" birthday using `HER_BIRTHDAY_MONTH` and `HER_BIRTHDAY_DAY`.
    2.  If it's a birthday:
        *   Sets `introOverlay.dataset.isBirthday = "true"` (for potential CSS styling).
        *   Hides the placeholder visual (`introVisual`).
        *   Sets custom birthday title and message content for `introTitle` and `introMessage`.
        *   Changes `recallButton` text.
    3.  Otherwise (not a birthday):
        *   Sets standard title, message, and button text.
        *   Shows the placeholder visual.
    4.  Calls `animate()` to start the rendering loop (which will initially show the intro overlay and the background).

##### <a name="function-startexperience"></a>`startExperience()`

*   **Purpose:** Initiates the main interactive experience after the user clicks the "Recall" / "Take the Journey" button.
*   **Process:**
    1.  Checks if `cameraPathCurve` and `storyPoints3D` are ready.
    2.  Uses `anime.js` to fade out the `introOverlay`.
    3.  On completion of the fade-out, adds a 'hidden' class and sets `display: none` to the overlay.
    4.  Gets the first point on the `cameraPathCurve` (`firstPointPos`) and a point slightly ahead (`firstLookAt`).
    5.  Uses `anime.js` to animate the camera from its initial position (`0, 2, 5`) to a position slightly behind and above the first story point, while also smoothly animating its look-at target towards `firstLookAt`.
    6.  On completion of the camera intro animation, resets `targetPathProgress` and `cameraPathProgress` to 0.
    7.  Calls `scheduleNextShootingStar()` to start the timed spawning of shooting stars.

##### <a name="function-handlemousemove"></a>`handleMouseMove(event)`

*   **Purpose:** Tracks the mouse cursor's position and updates the `mouse` vector (normalized device coordinates) used for raycasting. Also repositions the `pointInfoOverlay` if it's visible.
*   **Process:**
    1.  Calculates `mouse.x` and `mouse.y` from `event.clientX` and `event.clientY`.
    2.  If `pointInfoOverlay` is visible, calculates a new position for it near the cursor, ensuring it doesn't go off-screen.

##### <a name="function-handlemousewheel"></a>`handleMouseWheel(event)`

*   **Purpose:** Controls navigation along the `cameraPathCurve` using the mouse scroll wheel.
*   **Process:**
    1.  If a "focus on star" animation (`isFocusing`) is active or the intro is visible, it prevents default scroll and returns.
    2.  Prevents default page scrolling (`event.preventDefault()`).
    3.  Gets the scroll direction (`delta = Math.sign(event.deltaY)`).
    4.  Updates `targetPathProgress` by `delta * scrollSpeed`.
    5.  Clamps `targetPathProgress` between 0 and 1.
    *   The actual camera movement happens in `updateCamera` which interpolates `cameraPathProgress` towards `targetPathProgress`.

##### <a name="function-handlebackgroundclick"></a>`handleBackgroundClick(event)`

*   **Purpose:** Handles click events on the main canvas. Used to trigger focusing on a story star or spawning a shooting star on a background click.
*   **Process:**
    1.  If the intro is visible or a focus animation (`isFocusing`) is active, ignores the click.
    2.  Updates `mouse` coordinates from the click event.
    3.  Sets up the `raycaster` from the camera and mouse position.
    4.  Checks for intersections with objects in the `storyPoints3D` array.
    5.  If a story point is clicked (`intersects.length > 0` and `userData.isStoryPoint`):
        *   Calls `focusOnStar(clickedStar)`.
    6.  If the background is clicked (no story point intersection):
        *   Calls `spawnShootingStar()` (for manual testing/effect).

##### <a name="function-checkintersections"></a>`checkIntersections()`

*   **Purpose:** Manages hover effects on story points. Called every frame from `animate`.
*   **Process:**
    1.  If the intro is hidden and `storyPoints3D` exist:
        *   Sets up the `raycaster` from the camera and current `mouse` position.
        *   Finds intersections with `storyPoints3D`.
        *   **Hover Exit:** If a previously `intersectedObject` is no longer being hovered (or nothing is hovered):
            *   Restores its material's opacity (or emissiveIntensity if special) to its original state.
            *   Optionally animates its scale back to normal using `anime.js`.
            *   Resets `isHovered` flag and clears `intersectedObject`.
            *   Hides the `pointInfoOverlay`.
        *   **Hover Enter:** If a new object is intersected:
            *   Sets it as the `intersectedObject` and sets its `isHovered` flag.
            *   Provides visual feedback:
                *   For special stars (meshes): Could increase `emissiveIntensity`.
                *   For regular stars (sprites): Increases opacity to 1.0.
                *   Optionally animates its scale to be larger using `anime.js`.
            *   Populates `pointInfoOverlay` with the star's `userData` (title, date, note, image).
            *   Makes the `pointInfoOverlay` visible (its position is updated in `handleMouseMove`).

##### <a name="function-focusonstar"></a>`focusOnStar(targetStar)` *(If implemented)*

*   **Purpose:** Animates the camera to move towards and focus on a specific `targetStar`.
*   **Process:**
    1.  Sets a global `isFocusing = true` flag.
    2.  Disables `OrbitControls` (if they were active).
    3.  Gets the `targetPosition` (world position of the `targetStar`).
    4.  Calculates an `offsetDirection` from the star back towards the current camera position.
    5.  Calculates the `finalCameraPos` by placing the camera a set `focusDistance` away from the star along the `offsetDirection`.
    6.  Uses `anime.js` to animate `camera.position` to `finalCameraPos`.
    7.  In the animation's `update` callback, continuously calls `camera.lookAt(targetPosition)` to keep the star centered.
    8.  In the animation's `complete` callback:
        *   Sets `isFocusing = false`.
        *   Re-enables `OrbitControls` and updates their target to the `targetPosition`.

#### Effects & Animations

##### <a name="function-spawnshootingstar"></a>`spawnShootingStar()`

*   **Purpose:** Creates a single shooting star effect.
*   **Process:**
    1.  **Prerequisites:** Checks if `starTexture`, `camera`, `cosmicEventsGroup`, and `anime.js` are available, and if the intro is hidden.
    2.  **Positioning:**
        *   Calculates a `startPos` for the star. This is done by determining a point a random `spawnDistance` in front of the camera, then applying random offsets within the camera's approximate view frustum at that distance.
        *   Calculates an `endPos` by defining a `travelDirection` (mostly across the screen with some depth variation relative to the camera) and adding it to `startPos` scaled by a `travelDistance`.
    3.  **Appearance:** Defines a `baseScale` for the star.
    4.  **Material & Sprite:** Creates a `THREE.SpriteMaterial` using `starTexture`, configured for transparency, additive blending, and an initial opacity of 0. Creates a `THREE.Sprite`.
    5.  Sets the sprite's initial scale (square, using `baseScale`) and position (`startPos`).
    6.  Sets a high `renderOrder` (e.g., 999) so it draws on top.
    7.  Adds the sprite to `cosmicEventsGroup`.
    8.  **Animation with `anime.js`:**
        *   Animates a `props` object containing `progress` (0 to 1), `opacity`, and `scale`.
        *   `progress`: Used to `lerpVectors` the sprite's position between `startPos` and `endPos`.
        *   `opacity`: Keyframed to fade in quickly, stay bright, then fade out.
        *   `scale`: Keyframed to make the star grow slightly then shrink as it fades.
        *   In the `update` callback, the sprite's `position`, `material.opacity`, and `scale` are updated.
        *   In the `complete` callback, the sprite is removed from `cosmicEventsGroup`, and its material is disposed of.
    9.  Calls `spawnAfterimage()` periodically from its `update` loop to create a trail.

##### <a name="function-spawnafterimage"></a>`spawnAfterimage(position, startScale, startOpacity)` *(Helper for shooting stars)*

*   **Purpose:** Creates a single, short-lived "afterimage" sprite for the shooting star's trail.
*   **Process:**
    1.  Called by `spawnShootingStar`'s animation update.
    2.  Creates a new `THREE.Sprite` with `SpriteMaterial` using `starTexture`.
    3.  The material starts with the provided `startOpacity` (less than the main star) and a square `startScale` (smaller than the main star).
    4.  The sprite is positioned at the `position` where the main shooting star currently is.
    5.  It's given a slightly lower `renderOrder` than the main shooting star.
    6.  Added to `cosmicEventsGroup`.
    7.  A separate, short `anime.js` animation is started for this afterimage to fade its `opacity` to 0 and shrink its `scale`.
    8.  On completion, the afterimage sprite and its material are removed and disposed of.

##### <a name="function-schedulenextshootingstar"></a>`scheduleNextShootingStar()`

*   **Purpose:** Recursively schedules the spawning of shooting stars at random intervals.
*   **Process:**
    1.  Clears any existing `shootingStarTimeoutId`.
    2.  Calculates a random `delay` (e.g., 0.5 to 4.5 seconds).
    3.  Uses `setTimeout` to:
        *   Call `spawnShootingStar()`.
        *   Call `scheduleNextShootingStar()` again to queue the next one.
    4.  Stores the new timeout ID.

##### <a name="function-startpulsinganimation"></a>`startPulsingAnimation()`

*   **Purpose:** Initiates a looping animation for "special" story point stars to make them pulse.
*   **Process:**
    1.  Called at the end of `createStoryPoints()`.
    2.  Checks if `anime.js` and the `pulsingStars` array (containing special star meshes) are available.
    3.  Gets an array of the `material` objects from the `pulsingStars`.
    4.  Uses `anime.js` to target these materials:
        *   Animates `emissiveIntensity` between a low and high value (e.g., 0.3 to 1.0).
        *   Sets a `duration` for one pulse cycle.
        *   Uses `anime.stagger()` to slightly offset the start times of each star's pulse for a more organic effect.
        *   Uses `easeInOutSine` easing.
        *   Sets `direction: 'alternate'` and `loop: true` to make the animation repeat and reverse smoothly.

#### UI & Helper Functions

##### <a name="function-setupstatsui"></a>`setupStatsUI()`

*   **Purpose:** Initializes the age display and sets up event listeners for the stats tooltip.
*   **Process:**
    1.  Sets the initial text of `currentAgeSpan` (e.g., "0y 0m 0d").
    2.  Adds `mouseenter` listener to `ageDisplayContainer`:
        *   When hovered, calculates current age (`calculateAge(new Date())`) and lifetime stats (`calculateStats()`).
        *   Updates the `textContent` of elements within `statsTooltip` with formatted numbers.
        *   Makes `statsTooltip` visible.
    3.  Adds `mouseleave` listener to `ageDisplayContainer` to hide `statsTooltip`.

##### <a name="function-getpointdataatprogress"></a>`getPointDataAtProgress(progress)`

*   **Purpose:** Given a `progress` value (0 to 1) along the camera path, finds the `storyData` object corresponding to the nearest story point.
*   **Process:**
    1.  Calculates a float index: `progress * (storyData.length - 1)`.
    2.  Rounds this float index to the nearest integer.
    3.  Returns `storyData[roundedIndex]`.

##### <a name="function-calculateage"></a>`calculateAge(targetDate)`

*   **Purpose:** Calculates the age (years, months, days, totalDays) between the global `BIRTH_DATE` and a given `targetDate`.
*   **Process:** Standard date arithmetic to find differences in years, months, and days, handling negative day/month rollovers.

##### <a name="function-calculatestats"></a>`calculateStats(daysOld)`

*   **Purpose:** Calculates estimated lifetime statistics (heartbeats, breaths, moon orbits) based on the number of `daysOld`.
*   **Process:** Multiplies `daysOld` by daily rates derived from `AVG_HEARTBEATS_PER_MINUTE`, `AVG_BREATHS_PER_MINUTE`, and `AVG_MOON_ORBIT_DAYS`.

##### <a name="function-formatnumber"></a>`formatNumber(num)`

*   **Purpose:** Formats a number by adding commas as thousands separators.
*   **Process:** Converts number to string and uses a regular expression.

##### <a name="function-parseapproxdate"></a>`parseApproxDate(dateStr)`

*   **Purpose:** Attempts to parse various approximate date string formats (e.g., "YYYY", "~YYYY", "Month Day, YYYY") from `storyData` into JavaScript `Date` objects.
*   **Process:** Uses regular expressions and `new Date()` constructor with error handling and fallbacks for different formats. Returns `null` if parsing fails or for placeholder strings.

##### <a name="function-onwindowresize"></a>`onWindowResize()`

*   **Purpose:** Handles browser window resize events to keep the 3D scene rendering correctly.
*   **Process:**
    1.  Updates `camera.aspect` with the new `window.innerWidth / window.innerHeight`.
    2.  Calls `camera.updateProjectionMatrix()` to apply the aspect ratio change.
    3.  Resizes the `renderer` using `renderer.setSize()`.
    4.  Updates `renderer.setPixelRatio()` for high DPI screens.

---

## 10. Future Enhancements & Ideas

*   **More Sophisticated Background:** Implement a skybox with a nebula or milky way texture for greater depth.
*   **Lens Flares:** Add subtle lens flare effects to very bright story stars using `Lensflare.js`.
*   **Interactive Text:** Allow clicking on floating text for a small sound or visual feedback.
*   **Sound Design:** Implement spatial audio for story points, ambient space sounds, and UI feedback sounds.
*   **Time-Based Events:** Special visual effects on anniversaries or other significant dates.
*   **Performance Optimization:** For very long paths or many objects, explore instancing or Level of Detail (LOD) techniques.
*   **Text Wrapping:** For longer text in info panels or floating text, implement a text wrapping solution (can be complex for 3D text, often easier with HTML overlays or pre-rendered textures).
*   **Custom Font Upload:** Allow users to upload their own `.ttf` and convert it to typeface JSON on the fly (requires server-side or advanced client-side processing).

---

## 11. Customization Notes

*   **Story Content:** The primary customization is through the `storyData` array in `script-3d.js`. Update dates, titles, notes, images, and `textBefore` content here. Adjust 3D positions to shape the journey.
*   **Appearance:**
    *   Colors, sizes, and opacities for stars, text, and UI elements are defined as constants or within material properties in the respective creation functions.
    *   The `style-3d.css` file controls all 2D UI styling.
*   **Assets:** Replace placeholder images in the `images/` folder. Ensure your chosen font file is in the `fonts/` folder and correctly referenced.
*   **Animation Timings:** Durations, easings, and delays for `anime.js` animations (intro, focus, shooting stars, pulsing) can be tweaked within their respective functions.
*   **Interactivity Parameters:** `scrollSpeed`, hover effect intensity, text fade distances (`fadeInStartDistance`, `fullOpacityDistance`) can be adjusted.

---

## 12. Credits & Acknowledgements

*   **Three.js:** JavaScript 3D library by Mr.doob and contributors.
*   **Anime.js:** JavaScript animation engine by Julian Garnier.
*   *(Add any other libraries, assets, or inspirations you used)*
*   This project was created with love for Akanksha.

---