/**
 * Extract exercise data from legacy HTML files
 * This script parses the HTML exercise files and creates a JSON data file
 * that can be used by the main application
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const LEGACY_DIR = path.join(__dirname, '..', 'legacy');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'data', 'exercises.json');

/**
 * Get all exercise HTML files
 */
function getExerciseFiles() {
    try {
        const files = fs.readdirSync(LEGACY_DIR);
        return files.filter(file => 
            file.endsWith('_exercise_every_5th.html') ||
            file.endsWith('_exercise_every_6th.html') ||
            file.endsWith('_exercise_every_7th.html')
        ).sort();
    } catch (error) {
        console.error('Error reading legacy directory:', error);
        return [];
    }
}

/**
 * Parse exercise data from HTML content
 */
function parseExerciseFromHTML(htmlContent, filename) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    // Extract title
    const titleElement = document.querySelector('title');
    let title = titleElement ? titleElement.textContent : '';
    
    // Clean up title
    title = title
        .replace(' - Fill-in-the-blank Exercise (Version 1)', '')
        .replace(' - Fill-in-the-blank Exercise (Version 2)', '')
        .replace(' - Fill-in-the-blank Exercise (Version 3)', '')
        .trim();
    
    // Extract exercise content
    const exerciseContent = document.querySelector('.exercise-content');
    let description = '';
    let content = '';
    let blanks = [];
    
    if (exerciseContent) {
        // Get text content for description
        const textContent = exerciseContent.textContent || '';
        description = textContent.substring(0, 200).trim();
        if (textContent.length > 200) {
            description += '...';
        }
        
        // Get full HTML content
        content = exerciseContent.innerHTML;
        
        // Extract fill-in-the-blank data
        const blankInputs = exerciseContent.querySelectorAll('.fill-blank');
        blanks = Array.from(blankInputs).map((input, index) => ({
            index: index,
            answer: input.getAttribute('data-answer') || '',
            original: input.getAttribute('data-original') || '',
            size: parseInt(input.getAttribute('size')) || 8
        }));
    }
    
    // Extract metadata
    const lessonMatch = filename.match(/les(\d+)/);
    const lessonNumber = lessonMatch ? parseInt(lessonMatch[1], 10) : 0;
    
    let difficulty = 'medium';
    let difficultyLevel = 2;
    if (filename.includes('every_5th')) {
        difficulty = 'easy';
        difficultyLevel = 1;
    } else if (filename.includes('every_7th')) {
        difficulty = 'hard';
        difficultyLevel = 3;
    }
    
    const exerciseType = filename.includes('every_5th') ? 'Every 5th Word' :
                        filename.includes('every_6th') ? 'Every 6th Word' :
                        'Every 7th Word';
    
    return {
        id: filename.replace('.html', ''),
        filename: filename,
        title: title || `Lesson ${lessonNumber}`,
        description: description,
        content: content,
        lessonNumber: lessonNumber,
        difficulty: difficulty,
        difficultyLevel: difficultyLevel,
        exerciseType: exerciseType,
        blankCount: blanks.length,
        blanks: blanks,
        url: `legacy/${filename}`,
        createdAt: new Date().toISOString()
    };
}

/**
 * Process all exercise files
 */
async function processExercises() {
    console.log('🔍 Extracting exercise data from HTML files...');
    
    const exerciseFiles = getExerciseFiles();
    console.log(`📁 Found ${exerciseFiles.length} exercise files`);
    
    if (exerciseFiles.length === 0) {
        console.error('❌ No exercise files found in legacy directory');
        return;
    }
    
    const exercises = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const filename of exerciseFiles) {
        try {
            console.log(`📄 Processing ${filename}...`);
            
            const filePath = path.join(LEGACY_DIR, filename);
            const htmlContent = fs.readFileSync(filePath, 'utf8');
            
            const exerciseData = parseExerciseFromHTML(htmlContent, filename);
            exercises.push(exerciseData);
            
            successCount++;
            console.log(`✅ Successfully processed ${filename} (${exerciseData.blankCount} blanks)`);
            
        } catch (error) {
            console.error(`❌ Error processing ${filename}:`, error.message);
            errorCount++;
        }
    }
    
    // Sort exercises by lesson number and difficulty
    exercises.sort((a, b) => {
        if (a.lessonNumber !== b.lessonNumber) {
            return a.lessonNumber - b.lessonNumber;
        }
        return a.difficultyLevel - b.difficultyLevel;
    });
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write JSON data
    const outputData = {
        metadata: {
            totalExercises: exercises.length,
            generatedAt: new Date().toISOString(),
            version: '1.0.0'
        },
        exercises: exercises
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
    
    console.log('\n📊 Extraction Summary:');
    console.log(`✅ Successfully processed: ${successCount} files`);
    console.log(`❌ Errors: ${errorCount} files`);
    console.log(`📝 Total exercises: ${exercises.length}`);
    console.log(`💾 Output file: ${OUTPUT_FILE}`);
    
    // Generate statistics
    const stats = {
        byDifficulty: {
            easy: exercises.filter(e => e.difficulty === 'easy').length,
            medium: exercises.filter(e => e.difficulty === 'medium').length,
            hard: exercises.filter(e => e.difficulty === 'hard').length
        },
        byLesson: {}
    };
    
    exercises.forEach(exercise => {
        const lesson = `Lesson ${exercise.lessonNumber}`;
        stats.byLesson[lesson] = (stats.byLesson[lesson] || 0) + 1;
    });
    
    console.log('\n📈 Statistics:');
    console.log(`Easy exercises: ${stats.byDifficulty.easy}`);
    console.log(`Medium exercises: ${stats.byDifficulty.medium}`);
    console.log(`Hard exercises: ${stats.byDifficulty.hard}`);
    console.log(`Lessons covered: ${Object.keys(stats.byLesson).length}`);
    
    return exercises;
}

/**
 * Main function
 */
async function main() {
    try {
        await processExercises();
        console.log('\n🎉 Exercise data extraction completed successfully!');
    } catch (error) {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    processExercises,
    parseExerciseFromHTML
};
