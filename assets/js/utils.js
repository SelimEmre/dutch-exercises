/**
 * Utility functions for the fill-in-the-blank exercises application
 */

/**
 * Normalize text for comparison (remove diacritics, convert to lowercase, remove punctuation)
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w]/g, '');
}

/**
 * Calculate percentage score
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {number} Percentage score
 */
function calculateScore(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}



/**
 * Get exercise type from filename
 * @param {string} filename - Exercise filename
 * @returns {string} Exercise type
 */
function getExerciseType(filename) {
    if (filename.includes('every_5th')) return 'Every 5th Word';
    if (filename.includes('every_6th')) return 'Every 6th Word';
    if (filename.includes('every_7th')) return 'Every 7th Word';
    return 'Standard';
}

/**
 * Format lesson number from filename
 * @param {string} filename - Exercise filename
 * @returns {string} Formatted lesson number
 */
function formatLessonNumber(filename) {
    const match = filename.match(/les(\d+)/);
    return match ? `Lesson ${match[1]}` : filename;
}

/**
 * Extract lesson number for sorting
 * @param {string} filename - Exercise filename
 * @returns {number} Lesson number
 */
function getLessonNumber(filename) {
    const match = filename.match(/les(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Create HTML element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Node|Array} content - Element content
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Set content
    if (typeof content === 'string') {
        element.innerHTML = content;
    } else if (content instanceof Node) {
        element.appendChild(content);
    } else if (Array.isArray(content)) {
        content.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

/**
 * Show loading state
 * @param {HTMLElement} container - Container element
 */
function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading exercises...</p>
        </div>
    `;
}

/**
 * Show empty state
 * @param {HTMLElement} container - Container element
 * @param {string} message - Empty state message
 */
function showEmptyState(container, message = 'No exercises found') {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>
            <h3>No exercises found</h3>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Animate element entrance
 * @param {HTMLElement} element - Element to animate
 */
function animateIn(element) {
    element.classList.add('fade-in');
}

/**
 * Get stored user progress
 * @param {string} exerciseId - Exercise ID
 * @returns {Object|null} User progress data
 */
function getUserProgress(exerciseId) {
    try {
        const progress = localStorage.getItem(`progress_${exerciseId}`);
        return progress ? JSON.parse(progress) : null;
    } catch (error) {
        console.error('Error getting user progress:', error);
        return null;
    }
}

/**
 * Save user progress
 * @param {string} exerciseId - Exercise ID
 * @param {Object} progressData - Progress data to save
 */
function saveUserProgress(exerciseId, progressData) {
    try {
        localStorage.setItem(`progress_${exerciseId}`, JSON.stringify({
            ...progressData,
            lastUpdated: new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error saving user progress:', error);
    }
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    try {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Unknown';
    }
}

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Term to highlight
 * @returns {string} Text with highlighted terms
 */
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

/**
 * Escape special regex characters
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
