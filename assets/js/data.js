/**
 * Data management for fill-in-the-blank exercises
 * This file handles loading exercise data from JSON file or legacy HTML files
 */

// Exercise data cache
let exerciseCache = null;
let exerciseList = [];

// Try to load from JSON first, fallback to HTML parsing
const USE_JSON_DATA = false;

/**
 * List of available exercise files
 * This would normally come from a server API, but for GitHub Pages we'll define it statically
 */
const EXERCISE_FILES = [
    'les12_exercise_every_5th.html',
    'les12_exercise_every_6th.html',
    'les12_exercise_every_7th.html',
    'les13_exercise_every_5th.html',
    'les13_exercise_every_6th.html',
    'les13_exercise_every_7th.html',
    'les14_exercise_every_5th.html',
    'les14_exercise_every_6th.html',
    'les14_exercise_every_7th.html',
    'les15_exercise_every_5th.html',
    'les15_exercise_every_6th.html',
    'les15_exercise_every_7th.html',
    'les16_exercise_every_5th.html',
    'les16_exercise_every_6th.html',
    'les16_exercise_every_7th.html',
    'les17_exercise_every_5th.html',
    'les17_exercise_every_6th.html',
    'les17_exercise_every_7th.html',
    'les18_exercise_every_5th.html',
    'les18_exercise_every_6th.html',
    'les18_exercise_every_7th.html',
    'les19_exercise_every_5th.html',
    'les19_exercise_every_6th.html',
    'les19_exercise_every_7th.html',
    'les20_exercise_every_5th.html',
    'les20_exercise_every_6th.html',
    'les20_exercise_every_7th.html',
    'les21_exercise_every_5th.html',
    'les21_exercise_every_6th.html',
    'les21_exercise_every_7th.html',
    'les22_exercise_every_5th.html',
    'les22_exercise_every_6th.html',
    'les22_exercise_every_7th.html',
    'les23_exercise_every_5th.html',
    'les23_exercise_every_6th.html',
    'les23_exercise_every_7th.html',
    'les32_exercise_every_5th.html',
    'les32_exercise_every_6th.html',
    'les32_exercise_every_7th.html',
    'les33_exercise_every_5th.html',
    'les33_exercise_every_6th.html',
    'les33_exercise_every_7th.html',
    'les34_exercise_every_5th.html',
    'les34_exercise_every_6th.html',
    'les34_exercise_every_7th.html',
    'les35_exercise_every_5th.html',
    'les35_exercise_every_6th.html',
    'les35_exercise_every_7th.html',
    'les36_exercise_every_5th.html',
    'les36_exercise_every_6th.html',
    'les36_exercise_every_7th.html',
    'les37_exercise_every_5th.html',
    'les37_exercise_every_6th.html',
    'les37_exercise_every_7th.html',
    'les38_exercise_every_5th.html',
    'les38_exercise_every_6th.html',
    'les38_exercise_every_7th.html',
    'les39_exercise_every_5th.html',
    'les39_exercise_every_6th.html',
    'les39_exercise_every_7th.html',
    'les40_exercise_every_5th.html',
    'les40_exercise_every_6th.html',
    'les40_exercise_every_7th.html',
    'les41_exercise_every_5th.html',
    'les41_exercise_every_6th.html',
    'les41_exercise_every_7th.html',
    'les42_exercise_every_5th.html',
    'les42_exercise_every_6th.html',
    'les42_exercise_every_7th.html'
];

/**
 * Parse exercise data from HTML content
 * @param {string} htmlContent - HTML content of the exercise file
 * @param {string} filename - Filename of the exercise
 * @returns {Object} Parsed exercise data
 */
function parseExerciseFromHTML(htmlContent, filename) {
    console.log(`Parsing HTML for ${filename}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Extract title from the page title or first heading
    const titleElement = doc.querySelector('title');
    const h1Element = doc.querySelector('h1');
    console.log(`Title element found: ${!!titleElement}, H1 element found: ${!!h1Element}`);

    const title = titleElement?.textContent ||
                  h1Element?.textContent ||
                  formatLessonNumber(filename);
    console.log(`Extracted title: ${title}`);

    // Extract exercise content
    const exerciseContent = doc.querySelector('.exercise-content');
    console.log(`Exercise content found: ${!!exerciseContent}`);
    let description = '';
    let blankCount = 0;

    if (exerciseContent) {
        // Get text content for description (first 150 characters)
        const textContent = exerciseContent.textContent || '';
        description = textContent.substring(0, 150).trim();
        if (textContent.length > 150) {
            description += '...';
        }

        // Count fill-in-the-blank inputs
        const fillBlanks = exerciseContent.querySelectorAll('.fill-blank');
        blankCount = fillBlanks.length;
        console.log(`Found ${blankCount} fill-blank inputs`);
    } else {
        console.log(`No .exercise-content found in ${filename}`);
    }

    // Extract lesson number and exercise type
    const lessonNumber = getLessonNumber(filename);
    const exerciseType = getExerciseType(filename);
    console.log(`Lesson number: ${lessonNumber}, Exercise type: ${exerciseType}`);

    const result = {
        id: filename.replace('.html', ''),
        filename: filename,
        title: title.replace(' - Fill-in-the-blank Exercise (Version 1)', '')
                   .replace(' - Fill-in-the-blank Exercise (Version 2)', '')
                   .replace(' - Fill-in-the-blank Exercise (Version 3)', ''),
        description: description,
        lessonNumber: lessonNumber,
        exerciseType: exerciseType,
        blankCount: blankCount,
        url: `legacy/${filename}`
    };

    console.log(`Parsed result for ${filename}:`, result);
    return result;
}

/**
 * Load exercise data from a single HTML file
 * @param {string} filename - Exercise filename
 * @returns {Promise<Object>} Exercise data
 */
async function loadExerciseData(filename) {
    try {
        console.log(`Loading exercise: ${filename}`);
        const response = await fetch(`legacy/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status}`);
        }

        const htmlContent = await response.text();
        console.log(`HTML content length for ${filename}: ${htmlContent.length}`);
        const exerciseData = parseExerciseFromHTML(htmlContent, filename);
        console.log(`Successfully parsed: ${filename} - ${exerciseData.title} - ${exerciseData.blankCount} blanks`);
        console.log(`Exercise data:`, exerciseData);
        return exerciseData;
    } catch (error) {
        console.error(`Error loading exercise ${filename}:`, error);

        // Return fallback data if file can't be loaded
        return {
            id: filename.replace('.html', ''),
            filename: filename,
            title: formatLessonNumber(filename),
            description: 'Exercise content not available',
            lessonNumber: getLessonNumber(filename),
            exerciseType: getExerciseType(filename),
            blankCount: 0,
            url: `legacy/${filename}`,
            error: true
        };
    }
}

/**
 * Load exercise data from JSON file
 * @returns {Promise<Array>} Array of exercise data
 */
async function loadExercisesFromJSON() {
    try {
        const response = await fetch('assets/data/exercises.json');
        if (!response.ok) {
            throw new Error(`Failed to load exercises.json: ${response.status}`);
        }

        const data = await response.json();
        return data.exercises || [];
    } catch (error) {
        console.warn('Could not load exercises from JSON, falling back to HTML parsing:', error);
        return null;
    }
}

/**
 * Load all exercise data
 * @returns {Promise<Array>} Array of exercise data
 */
async function loadAllExercises() {
    if (exerciseCache) {
        return exerciseCache;
    }

    try {
        console.log('Loading exercises...');

        // Try to load from JSON first
        if (USE_JSON_DATA) {
            const jsonExercises = await loadExercisesFromJSON();
            // Only use JSON if it has a reasonable number of exercises (at least 80% of expected)
            const expectedCount = EXERCISE_FILES.length;
            const minExpectedCount = Math.floor(expectedCount * 0.8);

            if (jsonExercises && jsonExercises.length >= minExpectedCount) {
                exerciseCache = jsonExercises;
                console.log(`Loaded ${exerciseCache.length} exercises from JSON`);
                return exerciseCache;
            } else if (jsonExercises) {
                console.warn(`JSON data incomplete: ${jsonExercises.length} exercises found, expected at least ${minExpectedCount}. Falling back to HTML parsing.`);
            }
        }

        // Fallback to HTML parsing
        console.log('Falling back to HTML parsing...');
        console.log(`Attempting to load ${EXERCISE_FILES.length} exercise files`);
        const exercises = await Promise.all(
            EXERCISE_FILES.map(filename => loadExerciseData(filename))
        );

        console.log(`Loaded ${exercises.length} exercises, filtering out errors...`);

        // Check for errors
        const errorCount = exercises.filter(exercise => exercise.error).length;
        console.log(`Found ${errorCount} exercises with errors`);

        if (errorCount > 0) {
            console.log('Exercises with errors:', exercises.filter(exercise => exercise.error).map(e => e.filename));
        }

        // Filter out exercises with errors and sort alphabetically by title
        const exercisesWithErrors = exercises.filter(exercise => exercise.error);
        const exercisesWithoutErrors = exercises.filter(exercise => !exercise.error);

        console.log(`Exercises with errors: ${exercisesWithErrors.length}`);
        console.log(`Exercises without errors: ${exercisesWithoutErrors.length}`);

        if (exercisesWithErrors.length > 0) {
            console.log('Sample error exercise:', exercisesWithErrors[0]);
        }

        if (exercisesWithoutErrors.length > 0) {
            console.log('Sample good exercise:', exercisesWithoutErrors[0]);
        }

        // TEMPORARY: Use all exercises, not just ones without errors
        exerciseCache = exercises.sort((a, b) => a.title.localeCompare(b.title));

        console.log(`Successfully loaded ${exerciseCache.length} exercises from HTML`);
        console.log('First few exercises:', exerciseCache.slice(0, 3).map(e => e.title));
        return exerciseCache;
    } catch (error) {
        console.error('Error loading exercises:', error);
        return [];
    }
}

/**
 * Get all exercises with optional filtering
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Filtered exercises
 */
async function getExercises(filters = {}) {
    const allExercises = await loadAllExercises();
    let filteredExercises = [...allExercises];
    
    // Apply search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredExercises = filteredExercises.filter(exercise => 
            exercise.title.toLowerCase().includes(searchTerm) ||
            exercise.description.toLowerCase().includes(searchTerm) ||
            exercise.exerciseType.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'lesson':
                filteredExercises.sort((a, b) => a.lessonNumber - b.lessonNumber);
                break;
            case 'title':
                filteredExercises.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }
    
    return filteredExercises;
}

/**
 * Get exercise by ID
 * @param {string} exerciseId - Exercise ID
 * @returns {Promise<Object|null>} Exercise data
 */
async function getExerciseById(exerciseId) {
    const allExercises = await loadAllExercises();
    return allExercises.find(exercise => exercise.id === exerciseId) || null;
}
