// script-3d.js

// ---=== Three.js Modules (optional import style if using bundler, basic otherwise) ===---
// import * as THREE from 'three'; // If using npm/bundler
const THREE = window.THREE; // Assuming Three.js loaded globally via CDN

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded"); // DEBUG

    if (!THREE) {
        console.error("THREE.js library not loaded!");
        document.body.innerHTML = "<h1>Error: THREE.js library not found. Please check the script tag.</h1>";
        return;
    }
    if (!window.anime) {
         console.warn("Anime.js library not loaded! UI animations might not work smoothly.");
        // Provide fallback or just log warning
     } else {
        console.log("Anime.js library loaded."); // DEBUG
     }


     // ---=== UI State Variables ===---
let isStatsTooltipVisible = false;



    // ---=== Configuration & Constants ===---
    const BIRTH_DATE_STR = '2001-05-09';
    const BIRTH_DATE = new Date(BIRTH_DATE_STR);
    const AVG_HEARTBEATS_PER_MINUTE = 72;
    const AVG_BREATHS_PER_MINUTE = 15;
    const AVG_MOON_ORBIT_DAYS = 27.3;
    const STORY_POINT_COUNT = 32; // Number of placeholder points/images
    const HER_BIRTHDAY_MONTH = 4; // 0-indexed (0=Jan, 4=May)
    const HER_BIRTHDAY_DAY = 9;
    const STAR_IMAGE_PATH = 'images/star-glow.png'; // <<<=== ADDED: Path to your star image


// ---=== Parallax Star Configuration (will move to config.js later) ===---
const PARALLAX_STAR_CONFIG = {
    density: 2.0,         // Stars per unit of path length (higher = more stars)
    spreadRadius: 35,     // How far stars spread out perpendicular to the path
    starSize: 1.1,        // Visual size of the star points
    padding: 50,          // How far to extend star field before start / after end of curve
     bColor: 0xaaaaff, // Base color for these stars
    colorVariance: 0.4    // How much the color can vary
};

    // ---=== Element Selection ===---
    const canvas = document.getElementById('three-canvas');
    const introOverlay = document.getElementById('intro-overlay');
    const introTitle = document.getElementById('intro-title');
    const introMessage = document.getElementById('intro-message');
    const introVisual = document.getElementById('intro-visual'); // For the 'man' image
    const recallButton = document.getElementById('recall-button');
    const pointInfoOverlay = document.getElementById('point-info-overlay');
    const infoTitle = document.getElementById('info-title');
    const infoDate = document.getElementById('info-date');
    const infoImage = document.getElementById('info-image');
    const infoNote = document.getElementById('info-note');
    const ageDisplayContainer = document.getElementById('age-display-container');
    const currentAgeSpan = document.getElementById('current-age');
    const statsTooltip = document.getElementById('stats-tooltip');
    const statHeartbeatsSpan = document.getElementById('stat-heartbeats'); // NEW: Get specific spans
const statBreathsSpan = document.getElementById('stat-breaths'); // NEW
const statMoonOrbitsSpan = document.getElementById('stat-moon-orbits'); // NEW
const statCandlesSpan = document.getElementById('stat-candles'); // Get the new span
// ---=== Element Selection ===---
// ... (your existing element selections) ...
const infoImageContainer = document.getElementById('info-image-container'); // NEW
const infoImagePrevButton = document.getElementById('info-image-prev');   // NEW
const infoImageNextButton = document.getElementById('info-image-next');   // NEW
const infoImageDotsContainer = document.getElementById('info-image-dots'); // NEW



    // ---=== Global Three.js Variables ===---
    let scene, camera, renderer, controls; // Controls only for debugging
    let galaxyParticles;
    let storyPoints3D = []; // Array to hold the 3D objects for points
    let cameraPathCurve;
    let cameraPathProgress = 0; // Current progress along the path (0 to 1)
    const scrollSpeed = 0.0002; // Adjust mouse wheel sensitivity (reduced for slower scroll)
    let targetPathProgress = 0; // Target progress for smooth scrolling
    let starTexture; // <<<=== ADDED: Variable to hold the loaded star texture
    let cosmicEventsGroup; // <<<=== ADDED: Group for shooting stars etc.
    let shootingStarTimeoutId = null; // <<<=== ADDED: To manage the timeout loop
    let loadedFont = null; // To hold the loaded THREE.Font
    let pathTexts3D = [];  // Array to hold the 3D text meshes
    let pathTextGroup = null; // Optional group for text objects
    let parallaxStars = null;
    let distantStars = null;
    let pulsingStars = []; // Array to hold references to special stars for animation
    let storyData = []; // >>> Will be populated from JSON
    // ---=== Carousel State Variables ===---
let currentStoryPointImages = [];
let currentImageIndex = 0;
let imageChangeIntervalId = null; // For automatic cycling
let currentJourneyDisplayDate = new Date(); // Initialize to today, will be updated

const IMAGE_CYCLE_DELAY = 4000; // 4 seconds per image in auto-cycle



    // ---=== Interaction Variables ===---
    let raycaster, mouse;
    let intersectedObject = null; // Track currently hovered object

    // ---=== Story Point Data (Placeholders) ===---
    // ---=== Story Point Data (Placeholders) ===---
    // Structure: { date, title, note, image, position: [x, y, z], textBefore?: string }

// ---=== ASSET and DATA Loading ===---

// Function to fetch story data from JSON
async function fetchStoryData(url) { // url parameter is good
    console.log("Fetching story data from:", url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // More specific error for HTTP issues
            throw new Error(`HTTP error! Status: ${response.status} while fetching ${url}`);
        }
        const data = await response.json();
        console.log("Story data fetched successfully.");
        storyData = data; // Assign to global variable
        return data; // Resolve the promise with the data
    } catch (error) {
        console.error('Error fetching story data:', error);
        // This error will be caught by Promise.all's .catch()
        throw error; // Re-throw to be caught by Promise.all
    }
}

// Function to set up scene objects AFTER data and core assets load
function setupSceneAndAssets() {
    // Check if all necessary assets and data are loaded
 

    console.log("setupSceneAndAssets() called. All prerequisites loaded. Creating core scene objects..."); // DEBUG

    // These functions depend on storyData and loaded assets
    createCameraPath();
    createStoryPoints();
    createPathTexts();

   // Backgrounds (can be called once assets are globally available,
   // but materials should use the global vars which will be populated)
    createGalaxyBackground(); // Uses backgroundStarTexture
    createParallaxStars(); // Uses backgroundStarTexture - Adjust parameters if you like
    // createDistantStars(); // Uses backgroundStarTexture - uncomment if used instead of createGalaxyBackground

    // Interactions
    // Raycaster and mouse are initialized here now, after setup begins
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(-1, -1);

    // Age/Stats UI - already called in init, ensure it handles initial loading state
    // setupStatsUI(); // REMOVED - called earlier in init

    // Intro Logic (Starts animation loop)
    // handleIntro(); // REMOVED - called earlier in init

    console.log("All scene creation functions called."); // DEBUG
    // Now the experience is fully loaded, you could signal this if needed
}

    // ---=== Initialization Function ===---
    // ---=== Initialization Function ===---
      // ---=== Initialization Function ===---
// ---=== Initialization Function ===---
// The main init function now primarily starts the data fetching process.
// The rest of the setup happens *after* data is fetched in setupSceneAndAssets().
function init() {
    console.log("init() called. Setting up basic renderer and starting data/asset load...");
    scene = new THREE.Scene();

    // Camera - Initial position before any animation
    // *** FIX 1: Set camera further back initially to avoid starting IN the first star ***
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 5, 15); // Slightly higher and further back from origin (0,0,0)
    camera.lookAt(0, 0, 0); // Look towards origin initially

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000005);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Groups
    console.log("Creating groups");
    cosmicEventsGroup = new THREE.Group();
    scene.add(cosmicEventsGroup);
    pathTextGroup = new THREE.Group();
    scene.add(pathTextGroup);

    // ---=== Asset Loading ===---
    // ---=== Asset Loading (Promise-based) ===---
    console.log("Starting asset and data loading...");
    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new THREE.FontLoader();

    // Define asset paths (Good practice to have them easily accessible)
    const FONT_PATH = 'fonts/Orbitron_ExtraBold.json';
    // STAR_IMAGE_PATH is already a global constant
    const BACKGROUND_STAR_PATH = 'images/background-star-dot.png';
    const STORY_DATA_PATH = 'story.json';

    // Promise for Font Loading
    const fontPromise = new Promise((resolve, reject) => {
        fontLoader.load(FONT_PATH,
            (font) => {
                loadedFont = font; // Assign to global
                console.log("Font loaded successfully.");
                resolve(font);
            },
            undefined, // Progress callback (optional)
            (error) => {
                console.error('Font loading error:', error);
                reject(new Error('Failed to load font. Text will not appear.'));
            }
        );
    });

    // Promise for Main Star Texture Loading
    const starTexturePromise = new Promise((resolve, reject) => {
        // starTexture is already a global variable, so textureLoader.load will assign to it
        textureLoader.load(STAR_IMAGE_PATH,
            (texture) => {
                starTexture = texture; // Ensure global assignment
                console.log("Main star texture loaded successfully.");
                resolve(texture);
            },
            undefined,
            (error) => {
                console.error('Main star texture loading error:', error);
                reject(new Error('Failed to load main star texture.'));
            }
        );
    });

    // Promise for Background Star Texture Loading
    const backgroundTexturePromise = new Promise((resolve, reject) => {
        // backgroundStarTexture is already a global variable
        textureLoader.load(BACKGROUND_STAR_PATH,
            (texture) => {
                backgroundStarTexture = texture; // Ensure global assignment
                console.log("Background star texture loaded successfully.");
                resolve(texture);
            },
            undefined,
            (error) => {
                console.error('Background star texture loading error:', error);
                reject(new Error('Failed to load background star texture.'));
            }
        );
    });

    // Promise for Story Data Fetching (Modify your existing fetchStoryData)
    // We'll adjust fetchStoryData to return a promise.
    // The call to fetchStoryData will be inside Promise.all

    // Using Promise.all to wait for all assets and data
    Promise.all([
        fontPromise,
        starTexturePromise,
        backgroundTexturePromise,
        fetchStoryData(STORY_DATA_PATH) // fetchStoryData now needs to return a promise
    ])
    .then(([loadedFontResult, starTextureResult, backgroundTextureResult, storyDataResult]) => {
        // All assets and data are loaded successfully
        // The results are available if needed, but globals are already set.
        console.log("All assets and story data loaded successfully via Promise.all.");
        // storyData is already globally set by the modified fetchStoryData

        setupSceneAndAssets(); // Now call this ONCE
    })
    .catch(error => {
        // Handle any error from the loading promises
        console.error("An error occurred during asset/data loading:", error.message);
        // Display a more user-friendly error on the intro overlay
        if(introTitle && introMessage && recallButton) {
            introTitle.textContent = "Loading Error";
            introMessage.innerHTML = `Failed to load essential resources.<br>Please check the console for details and ensure your server is running.<br>Error: ${error.message}`;
            recallButton.style.display = 'none';
            if (introOverlay) {
                introOverlay.classList.remove('hidden');
                introOverlay.style.display = 'flex';
            }
        }
        // The animation loop (started in init) will continue showing this error.
    });
    // Event Listeners (Can be added immediately)
    console.log("Adding global event listeners");
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', handleMouseMove);
    // wheel listener logic will be updated in a later step for tooltip interaction
    window.addEventListener('wheel', handleMouseWheel, { passive: false });
    // click listener logic will be updated in a later step for tooltip interaction
    canvas.addEventListener('click', handleBackgroundClick);

    // Recall button listener is added immediately, but startExperience checks for loaded data
    recallButton.addEventListener('click', startExperience);

    setupCarouselNavListeners(); // <<<--- ADD THIS LINE


    // Initial UI setup (age is "Loading...")
     setupStatsUI(); // Call here to set initial UI state

    // Intro Logic (Handles initial message display)
     handleIntro(); // Call here to set intro text immediately

    // Start the initial animation loop to show the intro overlay while loading
    console.log("Starting initial animation loop."); // DEBUG
     animate(); // Start render loop even before data/assets load to display intro/loading state
}

    // ---=== Setup Functions ===---
// ---=== Carousel Helper Functions ===---

function clearImageChangeInterval() {
    if (imageChangeIntervalId) {
        clearInterval(imageChangeIntervalId);
        imageChangeIntervalId = null;
    }
}

function displayCurrentImage() {
    if (currentStoryPointImages.length === 0) {
        infoImage.style.display = 'none'; // Hide image element if no images
        infoImagePrevButton.style.display = 'none';
        infoImageNextButton.style.display = 'none';
        infoImageDotsContainer.style.display = 'none';
        return;
    }

    infoImage.style.display = 'block'; // Ensure image element is visible
    // Fade out current image
    infoImage.style.opacity = '0';

    setTimeout(() => { // Allow time for opacity to take effect before changing src
        infoImage.src = currentStoryPointImages[currentImageIndex];
        infoImage.alt = infoTitle.textContent + ` - Image ${currentImageIndex + 1}`;
        // Fade in new image
        infoImage.style.opacity = '1';
    }, 150); // Half of the CSS transition duration for opacity

    updateCarouselDots();
    updateCarouselNavButtons();
}

function updateCarouselNavButtons() {
    if (currentStoryPointImages.length > 1) {
        infoImagePrevButton.style.display = 'block';
        infoImageNextButton.style.display = 'block';
        // Disable buttons at ends if not looping
        // infoImagePrevButton.disabled = currentImageIndex === 0;
        // infoImageNextButton.disabled = currentImageIndex === currentStoryPointImages.length - 1;
    } else {
        infoImagePrevButton.style.display = 'none';
        infoImageNextButton.style.display = 'none';
    }
}

function updateCarouselDots() {
    if (currentStoryPointImages.length > 1) {
        infoImageDotsContainer.style.display = 'flex'; // Or 'block' if you prefer default flow
        infoImageDotsContainer.innerHTML = ''; // Clear existing dots
        currentStoryPointImages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === currentImageIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentImageIndex = index;
                displayCurrentImage();
                resetImageChangeInterval(); // Reset auto-cycle timer on manual interaction
            });
            infoImageDotsContainer.appendChild(dot);
        });
    } else {
        infoImageDotsContainer.style.display = 'none';
    }
}

function showNextImage() {
    if (currentStoryPointImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % currentStoryPointImages.length;
        displayCurrentImage();
    }
}

function showPrevImage() {
    if (currentStoryPointImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + currentStoryPointImages.length) % currentStoryPointImages.length;
        displayCurrentImage();
    }
}

function startImageAutoCycle() {
    clearImageChangeInterval(); // Clear any existing interval
    if (currentStoryPointImages.length > 1) {
        imageChangeIntervalId = setInterval(() => {
            showNextImage();
        }, IMAGE_CYCLE_DELAY);
    }
}

function resetImageChangeInterval() {
    clearImageChangeInterval();
    startImageAutoCycle();
}

// --- Event Listeners for Carousel Navigation (add these in init or setup) ---
function setupCarouselNavListeners() {
    infoImagePrevButton.addEventListener('click', () => {
        showPrevImage();
        resetImageChangeInterval(); // Reset auto-cycle on manual nav
    });

    infoImageNextButton.addEventListener('click', () => {
        showNextImage();
        resetImageChangeInterval(); // Reset auto-cycle on manual nav
    });

    // Keyboard navigation
    window.addEventListener('keydown', (event) => {
        // Check if the pointInfoOverlay is visible to avoid global key hijacking
        if (!pointInfoOverlay.classList.contains('visible') || currentStoryPointImages.length <= 1) {
            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault(); // Prevent page scroll
            showPrevImage();
            resetImageChangeInterval();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault(); // Prevent page scroll
            showNextImage();
            resetImageChangeInterval();
        }
    });
}

    // ---=== Path Text Creation Function ===---
    function createPathTexts() {
        // Ensure font is loaded before trying to create text
        if (!loadedFont) {
            console.error("Cannot create path texts: Font not loaded yet.");
            return;
        }
        // Ensure story data is available
        if (!storyData || storyData.length === 0 || !starTexture || !starTexture.image) {
            console.warn("Cannot create story points: Prerequisites not met (Data, Texture). Skipping."); // Changed to warn
            return;
        }

        console.log("Creating path text objects..."); // DEBUG

        // Clear previous texts if any (e.g., on resize or re-init)
        if (pathTextGroup) {
            while (pathTextGroup.children.length > 0) {
                const child = pathTextGroup.children[0];
                pathTextGroup.remove(child);
                // Dispose geometry and material if they exist
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            }
        }
        pathTexts3D = []; // Reset the array

        // Text Parameters
        const textSize = 2;
        const textHeight = 0.5;
        // *** DEBUG: Use a bright, obvious color ***
        const textColor = 0xFF0000FF; // RED
        const textYOffset = 1.5;
        const textInterpolationFactor = 0.35;

        for (let i = 1; i < storyData.length; i++) {
            const currentPointData = storyData[i];
            const previousPointData = storyData[i - 1];

            if (currentPointData.textBefore && typeof currentPointData.textBefore === 'string' && currentPointData.textBefore.trim() !== '') {
                const textContent = currentPointData.textBefore;
                const pos1 = new THREE.Vector3(...previousPointData.position);
                const pos2 = new THREE.Vector3(...currentPointData.position);
                const textPosition = new THREE.Vector3().lerpVectors(pos1, pos2, textInterpolationFactor);
                textPosition.y += textYOffset;

                // Create Text Geometry
                const textGeometry = new THREE.TextGeometry(textContent, {
                    font: loadedFont,
                    size: textSize, height: textHeight, curveSegments: 6,
                });
                textGeometry.center(); // Center it

                // Create Material
                const textMaterial = new THREE.MeshBasicMaterial({
                    color: textColor, // Use DEBUG color
                    transparent: true,
                    // *** DEBUG: Force opacity to 1 ***
                    opacity: 0.8,
                    depthWrite: false,
                    side: THREE.DoubleSide
                });

                // Create Mesh
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.copy(textPosition);

                // --- REMOVED lookAt for DEBUGGING Orientation ---
                // const pathDirection = new THREE.Vector3().subVectors(pos2, pos1).normalize();
                // const lookTargetPos = textPosition.clone().add(pathDirection);
                // textMesh.lookAt(lookTargetPos);
                // --- Let's see the default orientation first ---

                // --- Store Data ---
                textMesh.userData = { isPathText: true, textId: `text-${i}` };

                // --- Add to Scene/Group and Array ---
                pathTexts3D.push(textMesh);
                if (pathTextGroup) { pathTextGroup.add(textMesh); } else { scene.add(textMesh); }
                console.log(`Created DEBUG text "${textContent}" at (${textPosition.x.toFixed(1)}, ${textPosition.y.toFixed(1)}, ${textPosition.z.toFixed(1)})`);
            }
            }
            console.log(`Finished creating ${pathTexts3D.length} path text objects.`);
        }
    


    function createGalaxyBackground() {
        console.log("createGalaxyBackground() called");

        if (!backgroundStarTexture || !backgroundStarTexture.image) {
            console.warn("createGalaxyBackground: Background star texture not ready. Skipping."); // Changed to warn
            return;
         }
        // Cleanup previous if exists
        if (galaxyParticles) {
            scene.remove(galaxyParticles);
            if (galaxyParticles.geometry) galaxyParticles.geometry.dispose();
            if (galaxyParticles.material) galaxyParticles.material.dispose();
            // console.log("-> Removed previous galaxy particles."); // Keep console less noisy
        }

        const starCount = 15000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const baseColor = new THREE.Color(0xaaaaff);
        const radiusSpread = 300;
        const baseRadius = 300;

        for (let i = 0; i < starCount; i++) {
            // ... (position and color calculation remains the same) ...
            const i3 = i * 3;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const radius = baseRadius + Math.random() * radiusSpread;
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            const colorVariance = (Math.random() - 0.5) * 0.4;
            colors[i3] = baseColor.r + colorVariance;
            colors[i3 + 1] = baseColor.g + colorVariance;
            colors[i3 + 2] = baseColor.b + colorVariance;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create Material
        const material = new THREE.PointsMaterial({
            map: backgroundStarTexture, // Use the texture
            // *** DEBUG: Make size very large ***
            size: 5.0,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            // *** DEBUG: Enable depthWrite ***
            depthWrite: false,
            vertexColors: true, // Keep vertex colors for tinting
             // REMOVED renderOrder from here
        });

        galaxyParticles = new THREE.Points(geometry, material);

        // *** Apply renderOrder to the OBJECT, not the material ***
        galaxyParticles.renderOrder = -2; // Draw background first

        scene.add(galaxyParticles);
        console.log(`-> Created galaxy background object.`);

        if (!backgroundStarTexture) {
            console.warn("   Background star texture was not loaded when material was created.");
        } else {
            console.log("   Background star material is using texture map.");
        }
    }



    function createStoryPoints() {
        console.log("createStoryPoints() called");
        if (!starTexture || !starTexture.image) {
            console.warn("Star texture not ready in createStoryPoints.");
            // Allow creation without texture for basic structure
        } else {
            console.log("Star texture IS ready in createStoryPoints.");
        }

        // --- Cleanup previous points and reset arrays ---
        storyPoints3D.forEach(obj => { // Remove previously created objects
             scene.remove(obj);
             if (obj.geometry) obj.geometry.dispose();
             if (obj.material) obj.material.dispose();
        });
        storyPoints3D = []; // Array for ALL interactive points (sprites + meshes)
        pulsingStars = []; // Array specifically for pulsing meshes
        // Remove old story points JUST IN CASE they weren't added to the array properly before
        scene.children = scene.children.filter(child => !(child.userData?.isStoryPoint));
        // -------------------------------------------------

        // --- Geometry for Special Stars ---
        const specialStarSize = 3.0; // Adjust visual size of the plane
        const planeGeometry = new THREE.PlaneGeometry(specialStarSize, specialStarSize);
        // ---------------------------------

        storyData.forEach((data, index) => {
            let pointObject; // Will hold either Sprite or Mesh
            const isSpecial = data.special || data.id === 'mom-star';

            if (isSpecial) {
                // --- Create Special Pulsing Star (Mesh) ---
                const emissiveColor = data.id === 'mom-star' ? 0xaaaaff : 0xffddaa; // Glow color
                const baseColor = data.id === 'mom-star' ? 0x8888dd : 0xccaa88; // Base color (slightly darker)

                const phongMaterial = new THREE.MeshPhongMaterial({
                    map: starTexture, // Apply the texture
                    color: baseColor,
                    emissive: emissiveColor, // The color of the glow
                    emissiveIntensity: 0.4, // Starting intensity (will be animated)
                    transparent: true,
                    opacity: 0.75, // Start slightly transparent
                    blending: THREE.AdditiveBlending, // Additive blend for glow
                    depthWrite: false,
                    side: THREE.DoubleSide // See texture from both sides
                });

                pointObject = new THREE.Mesh(planeGeometry, phongMaterial);
                // Note: PlaneGeometry doesn't auto-face camera like Sprite.
                // Its orientation depends on initial setup and camera path.
                // We might need pointObject.lookAt(camera.position) in animate loop if needed.

                // Add to the specific array for pulsing animation
                pulsingStars.push(pointObject);
                console.log(`-> Created SPECIAL star mesh: ${data.title}`);

            } else {
                // --- Create Regular Star (Sprite) ---
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: starTexture,
                    transparent: true,
                    opacity: 0.5, // Default non-hover opacity
                    color: 0xaaccff, // Default color for regular stars
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    sizeAttenuation: true
                });

                pointObject = new THREE.Sprite(spriteMaterial);
                pointObject.scale.set(2, 2, 1); // Keep original sprite scale
                 console.log(`-> Created REGULAR star sprite: ${data.title}`);
            }

            // --- Common Setup for Both Types ---
            pointObject.position.set(data.position[0], data.position[1], data.position[2]);
            pointObject.userData = {
                id: data.id || `point-${index}`,
                index: index,
                date: data.date,
                title: data.title,
                note: data.note,
                // NEW: Store the array of images, ensuring paths are correct
                images: data.images ? data.images.map(imgName => 'images/' + imgName) : [], // Handle if data.images is missing
                isEnd: data.isEnd || false,
                originalScale: isSpecial ? new THREE.Vector3(1, 1, 1) : new THREE.Vector3(2, 2, 1),
                isHovered: false,
                originalOpacity: isSpecial ? 0.75 : 0.5,
                isStoryPoint: true,
                isSpecial: isSpecial
            };
            if (isSpecial) {
                 pointObject.userData.originalEmissiveIntensity = 0.4;
             }


            storyPoints3D.push(pointObject); // Add to the main array for interactions
            scene.add(pointObject);
        });

        console.log(`Created ${storyPoints3D.length} total story points (${pulsingStars.length} special).`);

        // --- Start the pulsing animation AFTER points are created ---
        startPulsingAnimation();
        // ----------------------------------------------------------
    }


    function createCameraPath() {
        console.log("createCameraPath() called"); // DEBUG
        // ... (rest of function is likely fine) ...
        if (!storyData || storyData.length < 2) {
            console.error("Cannot create camera path: Insufficient story data. Creating minimal path.");
            // Create a minimal default path to prevent errors
            cameraPathCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,-5), new THREE.Vector3(0,0,5)]);
            return; // Return if data isn't ready
        }
        const curvePoints = storyData.map(data => new THREE.Vector3(data.position[0], data.position[1], data.position[2]));
        if (curvePoints.length < 2) {
             console.error("Need at least 2 points to create a curve!");
            cameraPathCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,-5), new THREE.Vector3(0,0,5)]);
             return;
         }
        cameraPathCurve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);
    }



// ---=== Parallax Star Creation Function ===---
function createParallaxStars() {

    const { density, spreadRadius, starSize, padding, bColor, colorVariance } = PARALLAX_STAR_CONFIG;
    // density: approximate number of stars per unit of path length
    // spreadRadius: how far stars spread out perpendicular to the path
    // starSize: size of the star points
    // padding: how far to extend the star field before the first point and after the last

    console.log(`Creating parallax stars (Density: ${density}, Spread: ${spreadRadius}, Size: ${starSize}, Padding: ${padding})`);

    // --- Prerequisites ---
    if (!storyData || storyData.length < 2) {
        console.error("Cannot create parallax stars: Insufficient story data.");
        return;
    }
    if (!backgroundStarTexture || !backgroundStarTexture.image) {
        console.warn("Cannot create parallax stars: Background star texture not ready.");
        // Don't return, allow creation but log warning - stars will be default points/squares
    }

    // --- Cleanup ---
    if (parallaxStars) {
        scene.remove(parallaxStars);
        if (parallaxStars.geometry) parallaxStars.geometry.dispose();
        if (parallaxStars.material) parallaxStars.material.dispose();
        parallaxStars = null;
        console.log("-> Removed previous parallax stars.");
    }

    const positions = [];
    const colors = [];
    const baseColor = new THREE.Color(bColor); // Match background tint? Or make slightly different?

    let totalEstimatedStars = 0;
    const tempVec1 = new THREE.Vector3();
    const tempVec2 = new THREE.Vector3();
    const segmentDir = new THREE.Vector3();
    const perpVec1 = new THREE.Vector3();
    const perpVec2 = new THREE.Vector3();
    const randomVec = new THREE.Vector3(); // For generating perpendicular offsets

    // --- Helper function to generate stars for a segment ---
    const generateStarsForSegment = (pStart, pEnd, segmentLength) => {
        const numStarsInSegment = Math.max(10, Math.floor(segmentLength * density)); // Ensure at least 1 star per segment
        totalEstimatedStars += numStarsInSegment;

        segmentDir.subVectors(pEnd, pStart).normalize();

        // --- Calculate perpendicular vectors (handle vertical segmentDir edge case) ---
        if (Math.abs(segmentDir.y) > 0.99) { // Segment is mostly vertical
            perpVec1.set(1, 0, 0); // Use X-axis as base
        } else {
            perpVec1.set(0, 1, 0); // Use Y-axis (up) as base
        }
        perpVec1.crossVectors(segmentDir, perpVec1).normalize(); // Get perpendicular vector 1 (e.g., right)
        perpVec2.crossVectors(segmentDir, perpVec1).normalize(); // Get perpendicular vector 2 (e.g., pseudo-up)
        // Now perpVec1 and perpVec2 form a plane orthogonal to segmentDir
        //----------------------------------------------------------------------

        for (let j = 0; j < numStarsInSegment; j++) {
            // Position along the segment
            const along = Math.random(); // Random position 0.0 to 1.0 along segment
            tempVec1.copy(pStart).lerp(pEnd, along); // Point on the direct line

            // Add random perpendicular offset within the spreadRadius
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * spreadRadius;
            randomVec.copy(perpVec1).multiplyScalar(Math.cos(angle) * radius)
                     .addScaledVector(perpVec2, Math.sin(angle) * radius);

            tempVec1.add(randomVec); // Add offset to the point

            positions.push(tempVec1.x, tempVec1.y, tempVec1.z);

            // Add slight color variation
            const colorVariance = (Math.random() - 0.5) * 0.5; // Slightly more variance?
            const finalColor = baseColor.clone();
            finalColor.r += colorVariance;
            finalColor.g += colorVariance;
            finalColor.b += colorVariance;
            colors.push(finalColor.r, finalColor.g, finalColor.b);
        }
    };
    // --- End Helper Function ---


    // --- Generate stars for the "before start" padding ---
    if (padding > 0) {
        const firstPoint = new THREE.Vector3(...storyData[0].position);
        const secondPoint = new THREE.Vector3(...storyData[1].position);
        const firstSegmentDir = tempVec1.subVectors(secondPoint, firstPoint).normalize(); // Direction of first segment
        const padStartPoint = tempVec2.copy(firstPoint).addScaledVector(firstSegmentDir, -padding); // Point 'padding' units behind first point
        generateStarsForSegment(padStartPoint, firstPoint, padding);
    }

    // --- Generate stars for each segment between story points ---
    for (let i = 0; i < storyData.length - 1; i++) {
        const p1 = new THREE.Vector3(...storyData[i].position);
        const p2 = new THREE.Vector3(...storyData[i + 1].position);
        const length = p1.distanceTo(p2);
        if (length > 0.01) { // Avoid generating for zero-length segments
             generateStarsForSegment(p1, p2, length);
        }
    }

    // --- Generate stars for the "after end" padding ---
    if (padding > 0) {
        const lastPoint = new THREE.Vector3(...storyData[storyData.length - 1].position);
        const secondLastPoint = new THREE.Vector3(...storyData[storyData.length - 2].position);
        const lastSegmentDir = tempVec1.subVectors(lastPoint, secondLastPoint).normalize(); // Direction of last segment
        const padEndPoint = tempVec2.copy(lastPoint).addScaledVector(lastSegmentDir, padding); // Point 'padding' units beyond last point
        generateStarsForSegment(lastPoint, padEndPoint, padding);
    }

    // --- Create Geometry ---
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // --- Create Material ---
    const material = new THREE.PointsMaterial({
        map: backgroundStarTexture, // Use the global texture
        size: starSize,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9, // Slightly less opaque than distant?
        blending: THREE.AdditiveBlending,
        depthWrite: false, // Keep false for blending
        vertexColors: true // Use the calculated vertex colors
    });

    // --- Create Points Object ---
    parallaxStars = new THREE.Points(geometry, material);
    parallaxStars.renderOrder = -1; // Draw after distant stars (-2), before main scene (0)

    scene.add(parallaxStars);
    console.log(`-> Created parallax stars object with approx ${totalEstimatedStars} points.`);

    if (!backgroundStarTexture) {
        console.warn("   Parallax star texture was not loaded when material was created.");
    }
}

/*
// ---=== Distant Star Creation Function ===---
function createDistantStars(starCount = 5000, radius = 1500, starSize = 0.8) {
    // starCount: Fewer stars for the distant layer
    // radius: Much larger radius for the sphere
    // starSize: Smaller size for distant effect

    console.log(`Creating distant stars (Count: ${starCount}, Radius: ${radius}, Size: ${starSize})`);

    // --- Prerequisites ---
    // Texture check is useful here too
    if (!backgroundStarTexture || !backgroundStarTexture.image) {
        console.warn("Cannot create distant stars: Background star texture not ready.");
    }

    // --- Cleanup ---
    if (distantStars) {
        scene.remove(distantStars);
        if (distantStars.geometry) distantStars.geometry.dispose();
        if (distantStars.material) distantStars.material.dispose();
        distantStars = null;
        console.log("-> Removed previous distant stars.");
    }

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const baseColor = new THREE.Color(0x8888bb); // Maybe slightly different/dimmer base color?

    // Use the large radius for placement
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;

        // Spherical distribution within the large radius
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        // Place stars throughout the large sphere volume
        const r = Math.random() * radius; // Distribute within the radius, not just on surface

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        // Color variation
        const colorVariance = (Math.random() - 0.5) * 0.3; // Less variance?
        colors[i3] = baseColor.r + colorVariance;
        colors[i3 + 1] = baseColor.g + colorVariance;
        colors[i3 + 2] = baseColor.b + colorVariance;
    }

    // --- Create Geometry ---
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // --- Create Material ---
    const material = new THREE.PointsMaterial({
        map: backgroundStarTexture, // Use the same texture
        size: starSize,             // Use the smaller size
        sizeAttenuation: true,      // Still allow perspective scaling

        transparent: true,
        opacity: 0.8, // Maybe slightly less opaque?
        blending: THREE.AdditiveBlending, // Keep additive

        depthWrite: false,          // Keep false
        vertexColors: true          // Keep true for tinting
    });

    // --- Create Points Object ---
    distantStars = new THREE.Points(geometry, material);
    distantStars.renderOrder = -2; // <<<--- Draw these first (lowest renderOrder)

    scene.add(distantStars);
    console.log(`-> Created distant stars object with ${starCount} points.`);

    if (!backgroundStarTexture) {
        console.warn("   Distant star texture was not loaded when material was created.");
    }
}
*/
function setupStatsUI() {
    console.log("setupStatsUI() called");
    // Initialize the text content for all UI elements
    currentAgeSpan.textContent = `Loading...`; // Initial text while loading
    statHeartbeatsSpan.textContent = '...';
    statBreathsSpan.textContent = '...';
    statMoonOrbitsSpan.textContent = '...';
    statCandlesSpan.textContent = '...'; // Initialize candle span too


    // --- Tooltip Toggle Logic (Click/Hover) ---

    // Function to show the tooltip and update its content
    const showStatsTooltip = () => {
         // Only update content and show if data is ready
        if (storyData && storyData.length > 0) {
             // Calculate stats based on the *current* age (as of right now, not the progress point)
             const ageAtJourneyPoint = calculateAge(currentJourneyDisplayDate); // Uses global currentJourneyDisplayDate
        
        // Ensure totalDays is not negative if currentJourneyDisplayDate is before BIRTH_DATE (shouldn't happen with current logic but good check)
        const daysOldForStats = Math.max(0, ageAtJourneyPoint.totalDays);
        const stats = calculateStats(daysOldForStats);

        statHeartbeatsSpan.textContent = formatNumber(stats.heartbeats);
        statBreathsSpan.textContent = formatNumber(stats.breaths);
        statMoonOrbitsSpan.textContent = formatNumber(stats.moonOrbits);
        statCandlesSpan.textContent = formatNumber(stats.candles); // Candles are now based on years at journey point

        statsTooltip.classList.add('visible');
        }
    };

    // Function to hide the tooltip
    const hideStatsTooltip = () => {
         statsTooltip.classList.remove('visible'); // Remove CSS class to hide it
    };

    // Click Listener: Toggles the 'locked' visibility state
    // When clicked, it flips the isStatsTooltipVisible flag.
    // If it becomes true, it shows the tooltip. If it becomes false, it hides it.
    // It also stops the click event from doing anything else (like clicking the canvas).
    ageDisplayContainer.addEventListener('click', (event) => { // Added 'event' parameter
         isStatsTooltipVisible = !isStatsTooltipVisible; // Toggle the state (true -> false, false -> true)

        if (isStatsTooltipVisible) {
             showStatsTooltip(); // If the flag is now true, show the tooltip
        } else {
             hideStatsTooltip(); // If the flag is now false, hide the tooltip
        }
         // Prevent clicks on this container from triggering other listeners (like background click)
         event.stopPropagation(); // Stops the click event here!
    });

    // Hover Listener (MouseEnter): Show tooltip ONLY if it's NOT currently click-locked visible
    // This handles the temporary hover effect.
    ageDisplayContainer.addEventListener('mouseenter', () => {
         // Only show on hover IF the tooltip is NOT already visible due to a click
         if (!isStatsTooltipVisible) {
            showStatsTooltip(); // Show on hover
         }
    });

    // Hover Listener (MouseLeave): Hide tooltip ONLY if it's NOT currently click-locked visible
    // This hides the temporary hover effect when the mouse leaves.
    ageDisplayContainer.addEventListener('mouseleave', () => {
         // Only hide on mouse leave IF the tooltip is NOT currently visible due to a click
         if (!isStatsTooltipVisible) {
            hideStatsTooltip(); // Hide on mouse leave
         }
    });

    // --- End Tooltip Toggle Logic ---
}

    // ---=== Intro & Experience Start ===---

    function handleIntro() {
        console.log("handleIntro() called"); // DEBUG
        // ... (birthday logic is fine) ...
        const today = new Date();
        const isBirthday = today.getMonth() === HER_BIRTHDAY_MONTH && today.getDate() === HER_BIRTHDAY_DAY;
    
          //  introOverlay.dataset.isBirthday = "false"; introVisual.style.display = 'block';
           // introTitle.textContent = "A Journey For You";
            //introMessage.textContent = "Let's recall some moments, woven into the stars...";
            //recallButton.textContent = "Begin Recall";
        
        console.log("Starting animation loop from handleIntro"); // DEBUG
        animate(); // Start render loop
    }

    function startExperience() {
        console.log("startExperience() called"); // DEBUG

        // Original check was simpler, primarily for assets needed for camera animation
        if (!cameraPathCurve || storyPoints3D.length === 0) { // Simpler check
            console.warn("Experience cannot start: Core path/points data not ready.");
            introMessage.textContent = "Loading journey data... Please wait a moment.";
            return;
        }

        console.log("Starting intro overlay fade animation"); // DEBUG
        // Use anime.js to fade out the intro overlay
        anime({
            targets: introOverlay,
            opacity: [1, 0],
            duration: 1500, // Original duration
            easing: 'easeInOutQuad',
            complete: () => {
                console.log("Intro overlay fade complete. Adding 'hidden' class."); // DEBUG
                introOverlay.classList.add('hidden');
                introOverlay.style.display = 'none';
            }
        });

        // --- Camera Intro Animation (Original values) ---
        const firstPointPos = cameraPathCurve.getPointAt(0);
        const tangentAtStart = cameraPathCurve.getTangentAt(0).normalize();

        // Original introCameraDistanceBehind was likely smaller, e.g., 15 or 20.
        // If the problem was it was too far *forward*, this value was too small or negative.
        // Let's use a value that places it slightly behind.
        const introCameraDistanceBehind = 20; // Original value, adjust if needed based on your initial path

        // The original code had camera.position.set(0, 5, 15) in init().
        // The intro animation target should bring it closer to the first point from behind.
        // Let's calculate introCameraTargetPos:
        // Point on the curve (firstPointPos) + vector pointing *away* from the start along the tangent
        // So, subtract the tangent scaled by the distance to go "behind" the first point relative to camera's direction of travel.
        // Or, if your path naturally progresses towards negative Z, and tangentAtStart.z is negative,
        // adding tangentAtStart * positive_distance will correctly move it further in negative Z.
        // Let's assume path progresses towards negative Z.
        const introCameraTargetPos = new THREE.Vector3().copy(firstPointPos)
                                         .addScaledVector(tangentAtStart, introCameraDistanceBehind);
                                         // This line was likely: .addScaledVector(tangentAtStart.clone().negate(), introCameraDistanceBehind);
                                         // OR simply ensure introCameraDistanceBehind moves it to a Z > firstPointPos.z if firstPointPos.z is -20.
                                         // Example: If firstPoint is at z=-20, and tangent moves towards -Z,
                                         // then startPos for animation is firstPointPos + tangent * positive_distance_behind
                                         // This means the camera's z might be -20 + (-1 * 20) = -40.
                                         // The camera starts at z=15. So this is a move from z=15 to z=-40.

        // To ensure camera is BEHIND the first point, and facing it:
        // Let camera target be slightly in front of firstPointPos (e.g., cameraPathCurve.getPointAt(0.001))
        // and camera position be firstPointPos + (tangentAtStart * -introCameraDistanceBehind)
        // if tangentAtStart points "forward".
        // Let's refine:
        const lookAtTarget = cameraPathCurve.getPointAt(0.001); // Look slightly into the path
        const cameraStartAnimPos = new THREE.Vector3().copy(firstPointPos)
                                        .addScaledVector(tangentAtStart.clone().negate(), introCameraDistanceBehind); // Position camera behind the first point

        let cameraAnimationProps = {
            posX: camera.position.x, // Current camera position
            posY: camera.position.y,
            posZ: camera.position.z,
            lookX: camera.position.x + camera.getWorldDirection(new THREE.Vector3()).x, // Current lookAt (approx)
            lookY: camera.position.y + camera.getWorldDirection(new THREE.Vector3()).y,
            lookZ: camera.position.z + camera.getWorldDirection(new THREE.Vector3()).z
        };

        console.log("Starting camera intro animation from:", camera.position.toArray(), "to:", cameraStartAnimPos.toArray());
        console.log("Target lookAt:", lookAtTarget.toArray());

        anime({
            targets: cameraAnimationProps,
            posX: cameraStartAnimPos.x,
            posY: cameraStartAnimPos.y,
            posZ: cameraStartAnimPos.z,
            lookX: lookAtTarget.x,
            lookY: lookAtTarget.y,
            lookZ: lookAtTarget.z,
            duration: 4000, // Original duration, adjust if needed
            easing: 'easeInOutSine',
            update: function() {
                camera.position.set(cameraAnimationProps.posX, cameraAnimationProps.posY, cameraAnimationProps.posZ);
                camera.lookAt(cameraAnimationProps.lookX, cameraAnimationProps.lookY, cameraAnimationProps.lookZ);
            },
            complete: () => {
                console.log("Camera intro animation complete. Scroll enabled."); // DEBUG
                cameraPathProgress = 0;
                targetPathProgress = 0;
                scheduleNextShootingStar();
            }
         });

        // Original did NOT call scheduleNextShootingStar()
        scheduleNextShootingStar();  // REMOVE THIS LINE
    }
        // ---=== Pulsing Animation Function ===---
        function startPulsingAnimation() {
            if (!window.anime) {
                console.warn("Cannot start pulsing animation: anime.js not loaded.");
                return;
            }
            if (!pulsingStars || pulsingStars.length === 0) {
                console.log("No special stars found to animate pulsing.");
                return;
            }
    
            console.log(`Starting pulsing animation for ${pulsingStars.length} special stars.`);
    
            // Target the materials of the pulsing stars
            const targets = pulsingStars.map(starMesh => starMesh.material);
    
            // Start the animation loop
            anime({
                targets: targets, // Target the array of materials
                emissiveIntensity: [0.3, 1.0], // Animate between dim (0.3) and bright (1.0)
                // opacity: [0.6, 0.9], // Optional: Also pulse opacity slightly?
    
                duration: 2500, // Duration of one pulse cycle (in ms)
                delay: anime.stagger(100), // Stagger start times slightly for variation
                easing: 'easeInOutSine', // Smooth easing
                direction: 'alternate', // Go back and forth between intensity values
                loop: true // Repeat indefinitely
            });
        }

    // ---=== Interaction Handlers ===---

    function handleMouseMove(event) { /* ... likely fine ... */
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        if (pointInfoOverlay.classList.contains('visible')) {
            const buffer = 20; let newX = event.clientX + buffer; let newY = event.clientY + buffer;
            const overlayWidth = pointInfoOverlay.offsetWidth || 350; const overlayHeight = pointInfoOverlay.offsetHeight || 200;
            if (newX + overlayWidth > window.innerWidth) { newX = event.clientX - overlayWidth - buffer; }
            if (newY + overlayHeight > window.innerHeight) { newY = event.clientY - overlayHeight - buffer; }
            newX = Math.max(buffer, newX); newY = Math.max(buffer, newY);
            pointInfoOverlay.style.left = `${newX}px`; pointInfoOverlay.style.top = `${newY}px`; }
    }

    function handleMouseWheel(event) { /* ... likely fine ... */
  
    /*if (isStatsTooltipVisible) { // If stats tooltip is visible
        event.preventDefault(); // Prevent default scroll
        return; // Stop function execution
    }*/
        if (introOverlay.classList.contains('hidden')) {
             event.preventDefault(); 
             const delta = Math.sign(event.deltaY);
            targetPathProgress += delta * scrollSpeed;
            targetPathProgress = Math.max(0, Math.min(1, targetPathProgress)); }
    }

    function handleBackgroundClick(event) {
        console.log("handleBackgroundClick fired."); // DEBUG
        if (isStatsTooltipVisible) { // If stats tooltip is visible
            console.log("--> Click ignored: Stats tooltip is visible.");
            return; // Stop function execution
       }
        if (introOverlay.classList.contains('hidden')) {
            console.log("Intro overlay IS hidden."); // DEBUG
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(storyPoints3D);
            console.log("Intersects with story points:", intersects.length); // DEBUG

            if (intersects.length === 0) {
                console.log("--> Background clicked - Calling spawnShootingStar() from click."); // DEBUG
                spawnShootingStar();
            } else {
                console.log("--> Clicked on a story point, not spawning star."); // DEBUG
            }
        } else {
            console.log("Intro overlay is NOT hidden, click ignored."); // DEBUG
        }
    }


    function checkIntersections() {
        if (introOverlay.classList.contains('hidden') && storyPoints3D.length > 0) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(storyPoints3D);
    
            // --- Handle Hover Exit ---
            if (intersectedObject && (intersects.length === 0 || intersects[0].object !== intersectedObject)) {
                if (intersectedObject.userData?.isStoryPoint) {
                    intersectedObject.material.opacity = intersectedObject.userData.originalOpacity;
                    if (window.anime) anime({ targets: intersectedObject.scale, x: intersectedObject.userData.originalScale.x, y: intersectedObject.userData.originalScale.y, duration: 150, easing: 'easeOutQuad' });
                    intersectedObject.userData.isHovered = false;
                }
                intersectedObject = null;
                pointInfoOverlay.classList.remove('visible');
                clearImageChangeInterval(); // Stop auto-cycling images
                currentStoryPointImages = []; // Clear current images
                // Hide carousel UI elements explicitly on exit
                infoImagePrevButton.style.display = 'none';
                infoImageNextButton.style.display = 'none';
                infoImageDotsContainer.style.display = 'none';
    
            } else if (intersects.length > 0) {
                // --- Handle Hover Enter or Hovering Same Story Point ---
                const closestIntersect = intersects[0];
    
                if (closestIntersect.object.userData?.isStoryPoint) {
                    if (intersectedObject !== closestIntersect.object) {
                        // --- Hovering a *new* story point ---
                        // Restore previous if any
                        if (intersectedObject && intersectedObject.userData?.isStoryPoint) {
                            intersectedObject.material.opacity = intersectedObject.userData.originalOpacity;
                            if (window.anime) anime({ targets: intersectedObject.scale, x: intersectedObject.userData.originalScale.x, y: intersectedObject.userData.originalScale.y, duration: 150, easing: 'easeOutQuad' });
                            intersectedObject.userData.isHovered = false;
                        }
    
                        intersectedObject = closestIntersect.object;
                        intersectedObject.userData.isHovered = true;
    
                        // Apply hover visual effects (scale, opacity)
                        intersectedObject.material.opacity = 1.0;
                        if (window.anime) anime({ targets: intersectedObject.scale, x: intersectedObject.userData.originalScale.x * 1.25, y: intersectedObject.userData.originalScale.y * 1.25, duration: 150, easing: 'easeOutQuad' });
    
                        // --- Carousel Logic for New Hover ---
                        const data = intersectedObject.userData;
                        infoTitle.textContent = data.title;
                        infoDate.textContent = data.date;
                        infoNote.textContent = data.note;
    
                        currentStoryPointImages = data.images || [];
                        currentImageIndex = 0; // Start with the first image
    
                        if (currentStoryPointImages.length > 0) {
                            displayCurrentImage(); // Display the first image and set up dots/nav
                            startImageAutoCycle();   // Start automatic cycling
                        } else {
                            // No images for this point
                            infoImage.style.display = 'none';
                            infoImagePrevButton.style.display = 'none';
                            infoImageNextButton.style.display = 'none';
                            infoImageDotsContainer.style.display = 'none';
                            clearImageChangeInterval();
                        }
                        pointInfoOverlay.classList.add('visible');
                    }
                    // If intersectedObject === closestIntersect.object, we are hovering the same object.
                    // Auto-cycle and manual nav will continue.
                } else {
                    // Intersected something, but it's NOT a story point.
                    // If we were previously hovering a story point, exit that hover state.
                    if (intersectedObject && intersectedObject.userData?.isStoryPoint) {
                        intersectedObject.material.opacity = intersectedObject.userData.originalOpacity;
                        if (window.anime) anime({ targets: intersectedObject.scale, x: intersectedObject.userData.originalScale.x, y: intersectedObject.userData.originalScale.y, duration: 150, easing: 'easeOutQuad' });
                        intersectedObject.userData.isHovered = false;
                        pointInfoOverlay.classList.remove('visible');
                        clearImageChangeInterval();
                        currentStoryPointImages = [];
                        infoImagePrevButton.style.display = 'none';
                        infoImageNextButton.style.display = 'none';
                        infoImageDotsContainer.style.display = 'none';
                    }
                    intersectedObject = null;
                }
            }
        } else if (!introOverlay.classList.contains('hidden') && intersectedObject) {
            // --- Handle Case: Intro Becomes Visible While Hovering ---
            if (intersectedObject.userData?.isStoryPoint) {
                intersectedObject.material.opacity = intersectedObject.userData.originalOpacity;
                if (window.anime) anime({ targets: intersectedObject.scale, x: intersectedObject.userData.originalScale.x, y: intersectedObject.userData.originalScale.y, duration: 150, easing: 'easeOutQuad' });
                intersectedObject.userData.isHovered = false;
            }
            intersectedObject = null;
            pointInfoOverlay.classList.remove('visible');
            clearImageChangeInterval();
            currentStoryPointImages = [];
            infoImagePrevButton.style.display = 'none';
            infoImageNextButton.style.display = 'none';
            infoImageDotsContainer.style.display = 'none';
        }
    }
    // ---=== Update Functions ===---

        // ---=== Update Path Text Opacity Function ===---
        function updatePathTextOpacity() {
            // Only proceed if we have text objects and the camera exists
            if (!pathTexts3D || pathTexts3D.length === 0 || !camera) {
                return;
            }
    
            // --- Opacity Parameters (Adjust these) ---
            const fadeInStartDistance = 25; // Start fading in when camera is this close
            const fullOpacityDistance = 12; // Text is fully opaque when camera is this close or closer
            const opacityTransitionSpeed = 0.05; // How quickly opacity changes (lower = smoother/slower)
            // -----------------------------------------
    
            // Get the current camera position once for efficiency
            const cameraPos = camera.position;
    
            // Iterate through all the created path text meshes
            pathTexts3D.forEach(textMesh => {
                if (!textMesh || !textMesh.material) return; // Skip if mesh or material is invalid
    
                // Calculate the distance from the camera to the text object's center
                const distance = cameraPos.distanceTo(textMesh.position);
    
                let targetOpacity = 0; // Default to fully transparent
    
                // Determine the target opacity based on distance
                if (distance <= fullOpacityDistance) {
                    // Camera is very close or inside the full opacity zone
                    targetOpacity = 1.0;
                } else if (distance < fadeInStartDistance) {
                    // Camera is within the fade-in zone
                    // Calculate interpolation factor (0 = at fadeInStartDistance, 1 = at fullOpacityDistance)
                    const factor = 1.0 - (distance - fullOpacityDistance) / (fadeInStartDistance - fullOpacityDistance);
                    targetOpacity = Math.max(0, Math.min(1, factor)); // Clamp between 0 and 1
                }
                // Else (distance >= fadeInStartDistance), targetOpacity remains 0
    
                // Smoothly interpolate the current opacity towards the target opacity
                // This prevents sudden jumps in visibility
                const currentOpacity = textMesh.material.opacity;
                const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * opacityTransitionSpeed;
    
                // Apply the new opacity, but only update if it actually changed significantly
                // to avoid unnecessary material updates
                if (Math.abs(newOpacity - currentOpacity) > 0.001) {
                     textMesh.material.opacity = newOpacity;
                }
    
                // Optional: Make text slightly larger when fully visible?
                // if (targetOpacity > 0.95) {
                //     // Smoothly animate scale using anime.js or lerp if needed
                // } else {
                //     // Return to original scale
                // }
            });
        }

    function updateCamera() {
      /* ... likely fine ... */
      if (introOverlay.classList.contains("hidden") && cameraPathCurve) {
        cameraPathProgress += (targetPathProgress - cameraPathProgress) * 0.1;
        if (Math.abs(targetPathProgress - cameraPathProgress) < 0.0001) {
          cameraPathProgress = targetPathProgress;
        }
        cameraPathProgress = Math.max(0, Math.min(1, cameraPathProgress));
        const position = cameraPathCurve.getPointAt(cameraPathProgress);
        const lookAtProgress = Math.min(cameraPathProgress + 0.01, 1);
        const lookAtPoint = cameraPathCurve.getPointAt(lookAtProgress);
        if (!isNaN(position.x) && !isNaN(lookAtPoint.x)) {
          camera.position.copy(position);
          camera.lookAt(lookAtPoint);
        } else {
          /* console.warn("NaN detected in camera path calculation. Progress:", cameraPathProgress); */
        }
        if (galaxyParticles) {
           galaxyParticles.position.copy(camera.position);
            //galaxyParticles.rotation.y += 0.00005;
            //galaxyParticles.rotation.x += 0.00002;
         }
    //  } // Quieten console
    //  if (galaxyParticles) {
        //galaxyParticles.position.copy(camera.position);
     //   galaxyParticles.rotation.y += 0.00005;
      //  galaxyParticles.rotation.x += 0.00002;
      //}

       // --- Background Star Rotation (Now independent of camera movement) ---
        // Rotate the distant sphere very slowly
        if (distantStars) {
            distantStars.rotation.y += 0.000015; // Very slow rotation
            distantStars.rotation.x += 0.000005;
       }
       // Optionally rotate the parallax stars too, maybe differently?
       if (parallaxStars) {
          //  parallaxStars.rotation.y -= 0.00002; // Example: slight counter-rotation? Or none.
       }
    }
}

function updateAgeBasedOnProgress() {
    if (
        introOverlay.classList.contains("hidden") &&
        storyData &&
        storyData.length > 0
    ) {
        const currentPointData = getPointDataAtProgress(cameraPathProgress);
        if (currentPointData) {
            const approxEventDate = parseApproxDate(currentPointData.date);
            // Determine the date to use for age calculation
            const displayDate =
                approxEventDate && approxEventDate < new Date() // Use event date if it's in the past
                    ? approxEventDate
                    : (cameraPathProgress >= 1.0 ? new Date() : (approxEventDate || new Date())); // If at end, use today, else event date or today as fallback
            
            currentJourneyDisplayDate = displayDate; // <<<--- STORE THE JOURNEY DATE

            if (displayDate) {
                const age = calculateAge(displayDate); // Calculate age against BIRTH_DATE
                currentAgeSpan.textContent = `${age.years}y ${age.months}m ${age.days}d (${formatNumber(age.totalDays)} days old)`;
            } else {
                currentAgeSpan.textContent = `---`;
            }
        } else { // Fallback if no currentPointData (e.g., before first point if logic allows)
             if (storyData && storyData.length > 0) {
                const firstPointDate = parseApproxDate(storyData[0].date) || BIRTH_DATE;
                currentJourneyDisplayDate = firstPointDate; // <<<--- STORE FALLBACK
                const age = calculateAge(firstPointDate);
                currentAgeSpan.textContent = `${age.years}y ${age.months}m ${age.days}d (${formatNumber(age.totalDays)} days old)`;
            } else {
                 currentJourneyDisplayDate = BIRTH_DATE; // <<<--- STORE FALLBACK
                 currentAgeSpan.textContent = `Loading...`;
            }
        }
        // This specific condition for progress > 0.98 might be redundant with the above logic
        // if (cameraPathProgress > 0.98) { // If very near the end, show current age as of today
        //    currentJourneyDisplayDate = new Date(); // <<<--- STORE TODAY
        //    const age = calculateAge(new Date());
        //    currentAgeSpan.textContent = `${age.years}y ${age.months}m ${age.days}d (${formatNumber(age.totalDays)} days old)`;
        // }
    } else { // If intro is visible
        currentJourneyDisplayDate = BIRTH_DATE; // <<<--- STORE BIRTH_DATE
        currentAgeSpan.textContent = `0y 0m 0d`;
    }
}

    function getPointDataAtProgress(progress) {
      /* ... likely fine ... */
      if (!storyData || storyData.length === 0) return null;
      const index = progress * (storyData.length - 1);
      return storyData[Math.round(index)];
    }


    // ---=== Window Resize ===---
    function onWindowResize() { /* ... likely fine ... */
        camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    // ---=== Animation Loop ===---
    let animationFrameId = null;
    let frameCount = 0; // DEBUG counter for animation log
    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        // Basic scene updates always happen
        if (galaxyParticles) {
             galaxyParticles.rotation.y += 0.00005;
             galaxyParticles.rotation.x += 0.00002;
        }

        updatePathTextOpacity();

        // Updates only when experience is active
        if (introOverlay.classList.contains('hidden')) {
             updateCamera();
             checkIntersections();
             updateAgeBasedOnProgress();
        }

        // Always render
        renderer.render(scene, camera);
        frameCount++; // DEBUG
    }

// Keep the global variables and other functions as they are...

// <<<========================================>>>
// <<<=== Shooting Star Functionality ===>>>
// <<<========================================>>>

// Helper function to create short-lived trail sprites
function spawnAfterimage(position, startScale, startOpacity) {
    // Basic checks again, though unlikely to fail if main star spawned
    if (!starTexture || !starTexture.image || !cosmicEventsGroup || !window.anime) return;

    const material = new THREE.SpriteMaterial({
        map: starTexture,
        color: 0xffffee, // Can use a slightly different color if desired
        transparent: true,
        opacity: startOpacity, // Start less opaque
        blending: THREE.AdditiveBlending,
        rotation: Math.random() * Math.PI,
        sizeAttenuation: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(startScale, startScale, 1); // Square scale for afterimage too
    sprite.position.copy(position); // Set position where main star *was*
    sprite.renderOrder = 998; // Render slightly behind main star (optional)

    cosmicEventsGroup.add(sprite);

    // Short animation for the afterimage to fade and maybe shrink
    const afterimageProps = { opacity: startOpacity, scale: startScale };
    const afterimageDuration = 800 + Math.random() * 400; // Short lifespan (0.4-0.8s)

    anime({
        targets: afterimageProps,
        opacity: 0, // Fade out completely
        scale: startScale * 0.3, // Shrink significantly (optional)
        duration: afterimageDuration,
        easing: 'linear',
        update: () => {
            // Only need to update material/scale, position is fixed
            sprite.material.opacity = afterimageProps.opacity;
            sprite.scale.set(afterimageProps.scale, afterimageProps.scale, 1);
        },
        complete: () => {
            // Clean up this specific afterimage sprite
            cosmicEventsGroup.remove(sprite);
            if (sprite.material) { sprite.material.dispose(); }
        }
    });
}


// Main function to spawn the leading star and trigger afterimages
function spawnShootingStar() {
    console.log("spawnShootingStar() called."); // DEBUG

    // Check conditions PREVENTING spawn
    if (!starTexture || !starTexture.image || !camera || !cosmicEventsGroup || !window.anime || introOverlay.classList.contains('hidden') === false) {
        console.warn("--> spawnShootingStar aborted: Prerequisite missing or intro visible.", { /* ... */ }); // Keep checks
        return;
    }
     if (cosmicEventsGroup.position.lengthSq() > 0.001) { console.warn("--> WARNING: cosmicEventsGroup position is not at origin:", cosmicEventsGroup.position.toArray()); }

    console.log("--> Conditions met, proceeding to spawn star."); // DEBUG

    // --- Calculate Spawn Position relative to Camera ---
    // Use the settings you liked from the previous version
    const spawnDistance = 30 + Math.random() * 10; // CLOSE: 30-40 units away
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const viewHeight = 2 * Math.tan(vFOV / 2) * spawnDistance;
    const viewWidth = viewHeight * camera.aspect;

    const cameraRight = new THREE.Vector3().crossVectors(cameraDirection, camera.up).normalize();
    const cameraUp = new THREE.Vector3().crossVectors(cameraRight, cameraDirection).normalize();

    const centerSpawnPoint = camera.position.clone().add(cameraDirection.multiplyScalar(spawnDistance));

    const offsetX = (Math.random() - 0.5) * viewWidth * 0.7;
    const offsetY = (Math.random() - 0.5) * viewHeight * 0.7;

    const startPos = centerSpawnPoint.add(cameraRight.multiplyScalar(offsetX)).add(cameraUp.multiplyScalar(offsetY));

    // --- Calculate End Position (flying across view) ---
    const travelDistance = 50 + Math.random() * 60; // Keep shorter travel distance

    const randomRight = (Math.random() - 0.5) * 2;
    const randomUp = (Math.random() - 0.5) * 2;
    const randomForward = (Math.random() - 0.6) * 0.1; // Keep minimal depth change

    const travelDirection = new THREE.Vector3()
        .add(cameraRight.multiplyScalar(randomRight))
        .add(cameraUp.multiplyScalar(randomUp))
        .add(cameraDirection.multiplyScalar(randomForward))
        .normalize();

    const endPos = startPos.clone().add(travelDirection.multiplyScalar(travelDistance));

    // --- Base Size ---
    const baseScale = 2.5 + Math.random() * 2.5; // Adjusted base scale (2.5 to 5.0), keep it square

    // --- Material and Sprite (Main Star) ---
    const material = new THREE.SpriteMaterial({
        map: starTexture,
        color: 0xffffee,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        rotation: Math.random() * Math.PI,
        sizeAttenuation: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    // *** IMPORTANT: Set SQUARE scale using only baseScale ***
    sprite.scale.set(baseScale, baseScale, 1);
    sprite.position.copy(startPos);
    sprite.renderOrder = 999; // Keep main star on top

    console.log(`--> Adding MAIN sprite. Start Pos: (${startPos.x.toFixed(1)}, ${startPos.y.toFixed(1)}, ${startPos.z.toFixed(1)}), End Pos: (${endPos.x.toFixed(1)}, ${endPos.y.toFixed(1)}, ${endPos.z.toFixed(1)}), Scale: (${sprite.scale.x.toFixed(1)}, ${sprite.scale.y.toFixed(1)})`); // DEBUG
    cosmicEventsGroup.add(sprite);

    // --- Animation (Main Star + Triggering Afterimages) ---
    const props = { progress: 0, opacity: 0, scale: baseScale };
    const duration = 3000 + Math.random() * 2000; // Keep duration (3-5s)
    console.log(`--> Starting anime.js animation. Duration: ${duration.toFixed(0)}ms`); // DEBUG

    let afterimageCounter = 0; // Counter to throttle afterimage spawning
    const afterimageSpawnInterval = 3; // Spawn an afterimage every N updates

    anime({
        targets: props,
        progress: 1,
        keyframes: [ // Fade profile for main star
            { opacity: 0, duration: 50 },
            { opacity: 0.95, duration: duration * 0.8 }, // Stay bright longer
            { opacity: 0, duration: duration * 0.2 }
        ],
        scale: [baseScale, baseScale * 1.2, baseScale * 0.8], // Less drastic scale change for main star
        duration: duration,
        easing: 'linear',
        update: () => {
            // Update main star
            sprite.position.lerpVectors(startPos, endPos, props.progress);
            sprite.material.opacity = props.opacity;
            sprite.scale.set(props.scale, props.scale, 1); // Keep scale square

            // --- Spawn Afterimages Periodically ---
            afterimageCounter++;
            if (afterimageCounter % afterimageSpawnInterval === 0 && props.opacity > 0.1) { // Only spawn if main star is somewhat visible
                const currentAfterimageScale = props.scale * 0.6; // Start smaller
                const currentAfterimageOpacity = props.opacity * 0.5; // Start dimmer
                spawnAfterimage(sprite.position.clone(), currentAfterimageScale, currentAfterimageOpacity);
            }
        },
        complete: () => {
            console.log("--> MAIN Star animation complete. Removing sprite."); // DEBUG
            // Note: Main sprite removal might happen *before* all its afterimages have faded. This is usually fine.
            cosmicEventsGroup.remove(sprite);
            if (sprite.material) { sprite.material.dispose(); }
        }
    });
}

// Remember to keep the scheduleNextShootingStar and other unchanged functions

    function scheduleNextShootingStar() {
        console.log("scheduleNextShootingStar() called."); // DEBUG
        if (shootingStarTimeoutId) {
            console.log("--> Clearing previous timeout ID:", shootingStarTimeoutId); // DEBUG
            clearTimeout(shootingStarTimeoutId);
        }

        const delay = 500 + Math.random() * 4000;
        console.log(`--> Scheduling next star spawn in ${delay.toFixed(0)}ms.`); // DEBUG

        shootingStarTimeoutId = setTimeout(() => {
            console.log("--> Timeout fired. Calling spawnShootingStar() and rescheduling."); // DEBUG
            spawnShootingStar();
            scheduleNextShootingStar(); // Recursive call
        }, delay);
         console.log("--> New timeout ID:", shootingStarTimeoutId); // DEBUG
    }


    // ---=== Helper Functions ===---
    function calculateAge(targetDate) {
      /* ... likely fine ... */
      const now = new Date();
      targetDate = targetDate || now;
      if (!(targetDate instanceof Date) || isNaN(targetDate)) {
        targetDate = now;
      }
      let years = targetDate.getFullYear() - BIRTH_DATE.getFullYear();
      let months = targetDate.getMonth() - BIRTH_DATE.getMonth();
      let days = targetDate.getDate() - BIRTH_DATE.getDate();
      if (days < 0) {
        months--;
        const prevMonth = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          0
        );
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      const totalDays = Math.max(
        0,
        Math.floor(
          (targetDate.getTime() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      return {
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        totalDays: totalDays,
      };
    }
    function calculateStats(daysOld) {
      /* ... likely fine ... */
      const heartbeats = Math.floor(
        daysOld * 24 * 60 * AVG_HEARTBEATS_PER_MINUTE
      );
      const breaths = Math.floor(daysOld * 24 * 60 * AVG_BREATHS_PER_MINUTE);
      const moonOrbits = parseFloat((daysOld / AVG_MOON_ORBIT_DAYS).toFixed(1));
      const ageAtPoint = calculateAge(new Date(BIRTH_DATE.getTime() + daysOld * 24 * 60 * 60 * 1000));
    const candles = calculateCandles(ageAtPoint.years); // Calculate candles based on years lived up to this poi
      return { heartbeats, breaths, moonOrbits , candles };
    }

     function calculateCandles(years) {
     let total = 0;
     for (let i = 1; i <= years; i++) {
         total += i;
     }
     return total;
 }
    function formatNumber(num) {
      /* ... likely fine ... */
      if (isNaN(num)) return "0";
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function parseApproxDate(dateStr) {
      /* ... likely fine ... */
      if (!dateStr || typeof dateStr !== "string") return null;
      dateStr = dateStr.trim().toLowerCase();
      if (
        dateStr === "[year]" ||
        dateStr === "[date]" ||
        dateStr === "[recent]" ||
        dateStr === "today & beyond" ||
        dateStr === "always"
      )
        return null;
      let match = dateStr.match(/^~(\d{4})-(\d{4})$/);
      if (match) {
        const y1 = parseInt(match[1]),
          y2 = parseInt(match[2]);
        return new Date(Math.floor((y1 + y2) / 2), 5, 15);
      }
      match = dateStr.match(/^~(\d{4})$/);
      if (match) {
        return new Date(parseInt(match[1]), 5, 15);
      }
      match = dateStr.match(/^~end (\d{4})$/);
      if (match) {
        return new Date(parseInt(match[1]), 10, 15);
      }
      match = dateStr.match(/^~mid (\d{4})$/);
      if (match) {
        return new Date(parseInt(match[1]), 5, 15);
      }
      match = dateStr.match(/^~(\d{4})$/);
      if (match) {
        return new Date(parseInt(match[1]), 5, 15);
      }
      try {
        let d = new Date(dateStr);
        if (
          !isNaN(d.getTime()) &&
          d.getFullYear() > 1990 &&
          d.getFullYear() < 2050
        ) {
          return d;
        }
      } catch (e) {
        /* ignore */
      }
      match = dateStr.match(/^(\d{4})$/);
      if (match) {
        return new Date(parseInt(match[1]), 5, 15);
      }
      // console.warn("Could not parse date string:", dateStr); // Quieten console
      return null;
    }


    // ---=== Start Initialization ===---
    init();

}); // End DOMContentLoaded
