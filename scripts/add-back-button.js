#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all HTML files in the legacy directory
const legacyDir = path.join(__dirname, '..', 'legacy');
const htmlFiles = fs.readdirSync(legacyDir).filter(file => file.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files to update`);

// CSS link to add to the head section
const cssLink = `    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../assets/css/components.css">`;

// Back button HTML to add after the body tag
const backButtonHtml = `    <!-- Back Button -->
    <div class="back-button-container">
        <a href="../index.html" class="back-button">
            <svg class="back-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Exercises
        </a>
    </div>

`;

let updatedCount = 0;
let errorCount = 0;
let skippedCount = 0;

htmlFiles.forEach(filename => {
    try {
        const filePath = path.join(legacyDir, filename);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Check if already updated (avoid duplicate updates)
        if (content.includes('back-button-container')) {
            console.log(`Skipping ${filename} - already has back button`);
            skippedCount++;
            return;
        }

        // Add CSS links to head section (before </head>)
        if (!content.includes('../assets/css/styles.css')) {
            content = content.replace('</head>', `${cssLink}
</head>`);
            modified = true;
        }

        // Add back button after body tag
        if (content.includes('<body>')) {
            content = content.replace('<body>', `<body>
${backButtonHtml}`);
            modified = true;
        }

        // Remove difficulty indicators from version-info
        if (content.includes('Every') && content.includes('word removed')) {
            content = content.replace(/Version \d+: Every \d+\w+ word removed/g, 'Fill-in-the-blank Exercise');
            modified = true;
        }

        // Write the updated content back to the file only if modified
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            updatedCount++;
            console.log(`Updated ${filename}`);
        } else {
            console.log(`No changes needed for ${filename}`);
        }

    } catch (error) {
        console.error(`Error updating ${filename}:`, error.message);
        errorCount++;
    }
});

console.log(`\nUpdate complete:`);
console.log(`- Updated: ${updatedCount} files`);
console.log(`- Errors: ${errorCount} files`);
console.log(`- Skipped: ${skippedCount} files`);
