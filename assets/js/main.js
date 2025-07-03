/**
 * Main JavaScript file for the fill-in-the-blank exercises application
 */

// Debug logging function
function debugLog(message) {
    console.log(message);
    const debugDiv = document.getElementById('debugLog');
    if (debugDiv) {
        debugDiv.innerHTML += '<br>' + new Date().toLocaleTimeString() + ': ' + message;
    }
}

// Global state
let currentExercises = [];
let currentFilters = {
    search: '',
    sortBy: 'title'
};

// DOM elements
let searchInput;
let sortBySelect;
let exerciseGrid;
let exerciseCount;

/**
 * Initialize the application
 */
async function initializeApp() {
    debugLog('Initializing Fill-in-the-Blank Exercises App...');

    try {
        // Get DOM elements
        debugLog('Getting DOM elements...');
        searchInput = document.getElementById('searchInput');
        sortBySelect = document.getElementById('sortBy');
        exerciseGrid = document.getElementById('exerciseGrid');
        exerciseCount = document.getElementById('exerciseCount');

        debugLog('DOM elements found: ' + [searchInput, sortBySelect, exerciseGrid, exerciseCount].map(el => el ? 'OK' : 'MISSING').join(', '));

        // Set up event listeners
        debugLog('Setting up event listeners...');
        setupEventListeners();

        // Load and display exercises
        debugLog('Loading and displaying exercises...');
        await loadAndDisplayExercises();

        debugLog('App initialized successfully');
    } catch (error) {
        debugLog('Error initializing app: ' + error.message);
        console.error('Error initializing app:', error);
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Search input with debouncing
    if (searchInput) {
        const debouncedSearch = debounce(handleSearchChange, 300);
        searchInput.addEventListener('input', debouncedSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    // Sort select
    if (sortBySelect) {
        sortBySelect.addEventListener('change', applySorting);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * Handle search input changes
 */
function handleSearchChange() {
    currentFilters.search = searchInput.value.trim();
    loadAndDisplayExercises();
}

/**
 * Perform search (called by search button or Enter key)
 */
function performSearch() {
    currentFilters.search = searchInput.value.trim();
    loadAndDisplayExercises();
}



/**
 * Apply sorting
 */
function applySorting() {
    currentFilters.sortBy = sortBySelect.value;
    loadAndDisplayExercises();
}

/**
 * Load and display exercises based on current filters
 */
async function loadAndDisplayExercises() {
    try {
        // Show loading state
        showLoading(exerciseGrid);

        // Load exercises with current filters
        console.log('Loading exercises with filters:', currentFilters);
        currentExercises = await getExercises(currentFilters);
        console.log(`Loaded ${currentExercises.length} exercises after filtering`);

        // Update exercise count
        updateExerciseCount(currentExercises.length);

        // Display exercises
        displayExercises(currentExercises);

    } catch (error) {
        console.error('Error loading exercises:', error);
        showErrorState();
    }
}

/**
 * Display exercises in the grid
 * @param {Array} exercises - Array of exercise data
 */
function displayExercises(exercises) {
    console.log('displayExercises called with', exercises.length, 'exercises');

    // Update aria-busy state
    exerciseGrid.setAttribute('aria-busy', 'false');

    if (exercises.length === 0) {
        console.log('No exercises to display, showing empty state');
        showEmptyState(exerciseGrid, getEmptyStateMessage());
        return;
    }

    console.log('Displaying', exercises.length, 'exercises');

    // Clear the grid
    exerciseGrid.innerHTML = '';

    // Create exercise cards
    exercises.forEach((exercise, index) => {
        const card = createExerciseCard(exercise);
        exerciseGrid.appendChild(card);

        // Animate card entrance with slight delay
        setTimeout(() => {
            animateIn(card);
        }, index * 50);
    });

    // Announce to screen readers
    announceToScreenReader(`${exercises.length} exercises loaded`);
}

/**
 * Create an exercise card element
 * @param {Object} exercise - Exercise data
 * @returns {HTMLElement} Exercise card element
 */
function createExerciseCard(exercise) {
    const progress = getUserProgress(exercise.id);
    const completionPercentage = progress ? progress.completionPercentage || 0 : 0;
    
    const card = createElement('div', {
        className: 'exercise-card',
        dataset: { exerciseId: exercise.id },
        role: 'button',
        tabindex: '0',
        'aria-label': `${exercise.title} - ${exercise.exerciseType}`
    });

    card.innerHTML = `
        <div class="exercise-card-header">
            <h3 class="exercise-title">${exercise.title}</h3>
        </div>
        
        <div class="exercise-meta">
            <span class="exercise-type">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                ${exercise.exerciseType}
            </span>
            <span class="lesson-number">${formatLessonNumber(exercise.filename)}</span>
        </div>
        
        <p class="exercise-description">${exercise.description}</p>
        
        <div class="exercise-stats">
            <span class="exercise-blanks">
                ${exercise.blankCount} fill-in-the-blanks
            </span>
            ${completionPercentage > 0 ? `
                <span class="exercise-progress">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    ${completionPercentage}% complete
                </span>
            ` : ''}
        </div>
        
        ${completionPercentage > 0 ? `
            <div class="progress-bar" style="margin-top: 1rem;">
                <div class="progress-fill" style="width: ${completionPercentage}%"></div>
            </div>
        ` : ''}
    `;
    
    // Add click handler
    card.addEventListener('click', () => openExercise(exercise));
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openExercise(exercise);
        }
    });
    
    return card;
}

/**
 * Open an exercise
 * @param {Object} exercise - Exercise data
 */
function openExercise(exercise) {
    // Open the exercise in a new tab/window
    window.open(exercise.url, '_blank');
    
    // Track that the user opened this exercise
    const progress = getUserProgress(exercise.id) || {};
    progress.lastOpened = new Date().toISOString();
    progress.openCount = (progress.openCount || 0) + 1;
    saveUserProgress(exercise.id, progress);
}

/**
 * Update exercise count display
 * @param {number} count - Number of exercises
 */
function updateExerciseCount(count) {
    if (exerciseCount) {
        // Get total from cache if available
        const totalAvailable = exerciseCache ? exerciseCache.length : count;

        if (currentFilters.search) {
            exerciseCount.textContent = `Showing ${count} of ${totalAvailable} exercises`;
        } else {
            exerciseCount.textContent = `${count} exercises available`;
        }
    }
}

/**
 * Get appropriate empty state message
 * @returns {string} Empty state message
 */
function getEmptyStateMessage() {
    if (currentFilters.search) {
        return `No exercises found for "${currentFilters.search}". Try a different search term or check your spelling.`;
    }
    return 'No exercises are currently available. Please check back later.';
}

/**
 * Show error state
 */
function showErrorState() {
    exerciseGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </div>
            <h3>Error Loading Exercises</h3>
            <p>There was a problem loading the exercises. Please try refreshing the page.</p>
            <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
        </div>
    `;
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardNavigation(e) {
    // Focus search on Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Navigate exercise cards with arrow keys
    if (e.target.classList.contains('exercise-card')) {
        const cards = Array.from(document.querySelectorAll('.exercise-card'));
        const currentIndex = cards.indexOf(e.target);

        let nextIndex = currentIndex;

        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % cards.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                nextIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
                break;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = cards.length - 1;
                break;
        }

        if (nextIndex !== currentIndex && cards[nextIndex]) {
            cards[nextIndex].focus();
        }
    }
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Initialize the app when DOM is loaded
console.log('Setting up DOMContentLoaded listener...');
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOMContentLoaded fired, initializing app...');
    initializeApp();
});
