#!/usr/bin/env python3
"""
Fill-in-the-blank exercise generator for HTML files.
Creates three versions of each HTML file with different word removal patterns:
- Version 1: Remove every 5th word
- Version 2: Remove every 6th word  
- Version 3: Remove every 7th word
"""

import re
import os
import glob
from typing import List, Tuple

def get_ordinal_suffix(num: int) -> str:
    """Get the ordinal suffix for a number (1st, 2nd, 3rd, 4th, etc.)"""
    if 10 <= num % 100 <= 20:
        return f"{num}th"
    else:
        suffix_map = {1: "st", 2: "nd", 3: "rd"}
        return f"{num}{suffix_map.get(num % 10, 'th')}"

def extract_text_content(html_content: str) -> str:
    """
    Extract text content from HTML, preserving basic structure.
    Removes HTML tags but keeps the text flow.
    """
    # Remove HTML tags but keep the text
    text = re.sub(r'<[^>]+>', '', html_content)
    # Clean up extra whitespace while preserving line breaks
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

def split_into_words(text: str) -> List[Tuple[str, bool]]:
    """
    Split text into words while preserving punctuation and spacing.
    Returns list of tuples: (word_or_space, is_word)
    """
    # Split on word boundaries, keeping separators
    parts = re.split(r'(\s+)', text)
    result = []
    
    for part in parts:
        if part.strip():  # Non-whitespace part
            # Further split on punctuation boundaries
            word_parts = re.split(r'(\W+)', part)
            for word_part in word_parts:
                if word_part:
                    is_word = bool(re.match(r'\w+', word_part))
                    result.append((word_part, is_word))
        else:  # Whitespace
            result.append((part, False))
    
    return result

def create_fill_in_blank(text: str, nth_word: int) -> Tuple[str, List[str]]:
    """
    Create fill-in-the-blank version by replacing every nth word with input field.
    Returns tuple of (html_content, list_of_correct_answers)
    """
    parts = split_into_words(text)
    word_count = 0
    result = []
    correct_answers = []
    blank_index = 0

    for part, is_word in parts:
        if is_word:
            word_count += 1
            if word_count % nth_word == 0:
                # Store the correct answer (clean it from punctuation for comparison)
                clean_word = re.sub(r'[^\w]', '', part.lower())
                correct_answers.append(clean_word)

                # Replace with input field, size based on word length
                input_size = max(len(part), 8)
                input_field = f'<input type="text" size="{input_size}" class="fill-blank" data-answer="{clean_word}" data-original="{part}" data-index="{blank_index}" style="border: none; border-bottom: 1px solid #000; background: transparent;" placeholder="____" />'
                result.append(input_field)
                blank_index += 1
            else:
                result.append(part)
        else:
            result.append(part)

    return ''.join(result), correct_answers

def create_html_exercise(original_content: str, lesson_name: str, version: int, nth_word: int) -> str:
    """
    Create complete HTML exercise file with fill-in-the-blank content.
    """
    # Extract the main text content
    text_content = extract_text_content(original_content)

    # Create fill-in-the-blank version
    exercise_content, correct_answers = create_fill_in_blank(text_content, nth_word)
    
    # Create HTML structure with validation features
    ordinal_suffix = get_ordinal_suffix(nth_word)
    html_template = f"""<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{lesson_name} - Fill-in-the-blank Exercise (Version {version})</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }}
        .header {{
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .exercise-content {{
            background-color: #fafafa;
            padding: 20px;
            border-radius: 5px;
            border-left: 4px solid #007cba;
        }}
        input[type="text"] {{
            margin: 0 2px;
            padding: 2px 4px;
            font-size: inherit;
            font-family: inherit;
            transition: all 0.3s ease;
        }}
        input.correct {{
            background-color: #d4edda;
            border-bottom: 2px solid #28a745 !important;
        }}
        input.incorrect {{
            background-color: #f8d7da;
            border-bottom: 2px solid #dc3545 !important;
        }}
        .instructions {{
            background-color: #e7f3ff;
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 20px;
            font-style: italic;
        }}
        .version-info {{
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
        }}
        .controls {{
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }}
        .btn {{
            background-color: #007cba;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 0 5px;
            font-size: 14px;
        }}
        .btn:hover {{
            background-color: #005a87;
        }}
        .btn:disabled {{
            background-color: #6c757d;
            cursor: not-allowed;
        }}
        .score {{
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
        }}
        .feedback {{
            margin-top: 10px;
            padding: 10px;
            border-radius: 3px;
            display: none;
        }}
        .feedback.success {{
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }}
        .feedback.warning {{
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{lesson_name} - Fill-in-the-blank Exercise</h1>
        <div class="version-info">Version {version}: Every {ordinal_suffix} word removed</div>
    </div>

    <div class="instructions">
        <strong>Instructions:</strong> Fill in the blanks with the appropriate words.
        This exercise removes every {ordinal_suffix} word from the original text.
        <br><strong>Tip:</strong> Use the "Check Answers" button to see your results!
    </div>

    <div class="controls">
        <button class="btn" onclick="checkAnswers()">Check Answers</button>
        <button class="btn" onclick="showAnswers()">Show All Answers</button>
        <button class="btn" onclick="resetExercise()">Reset</button>
        <div class="score" id="score" style="display: none;"></div>
        <div class="feedback" id="feedback"></div>
    </div>

    <div class="exercise-content">
        {exercise_content}
    </div>
    
    <script>
        // Auto-resize input fields based on content
        document.addEventListener('input', function(e) {{
            if (e.target.type === 'text') {{
                const minSize = 8;
                const newSize = Math.max(e.target.value.length + 2, minSize);
                e.target.size = newSize;

                // Clear previous validation styling when user types
                e.target.classList.remove('correct', 'incorrect');
            }}
        }});

        function normalizeText(text) {{
            // Remove diacritics, convert to lowercase, remove punctuation
            return text.toLowerCase()
                      .normalize('NFD')
                      .replace(/[\\u0300-\\u036f]/g, '')
                      .replace(/[^\\w]/g, '');
        }}

        function checkAnswers() {{
            const inputs = document.querySelectorAll('.fill-blank');
            let correct = 0;
            let total = inputs.length;

            inputs.forEach(input => {{
                const userAnswer = normalizeText(input.value.trim());
                const correctAnswer = input.getAttribute('data-answer');

                if (userAnswer === correctAnswer) {{
                    input.classList.remove('incorrect');
                    input.classList.add('correct');
                    correct++;
                }} else {{
                    input.classList.remove('correct');
                    input.classList.add('incorrect');
                }}
            }});

            // Show score
            const scoreElement = document.getElementById('score');
            const percentage = Math.round((correct / total) * 100);
            scoreElement.textContent = `Score: ${{correct}}/${{total}} (${{percentage}}%)`;
            scoreElement.style.display = 'block';

            // Show feedback
            const feedbackElement = document.getElementById('feedback');
            feedbackElement.style.display = 'block';

            if (percentage >= 90) {{
                feedbackElement.className = 'feedback success';
                feedbackElement.textContent = 'Excellent work! You got most answers correct!';
            }} else if (percentage >= 70) {{
                feedbackElement.className = 'feedback success';
                feedbackElement.textContent = 'Good job! Keep practicing to improve further.';
            }} else {{
                feedbackElement.className = 'feedback warning';
                feedbackElement.textContent = 'Keep practicing! Try using the "Show Answers" button to learn.';
            }}
        }}

        function showAnswers() {{
            const inputs = document.querySelectorAll('.fill-blank');
            inputs.forEach(input => {{
                const originalWord = input.getAttribute('data-original');
                input.value = originalWord;
                input.classList.remove('incorrect');
                input.classList.add('correct');
            }});

            // Update score to show all correct
            const scoreElement = document.getElementById('score');
            scoreElement.textContent = `Answers shown: ${{inputs.length}}/${{inputs.length}} (100%)`;
            scoreElement.style.display = 'block';

            // Hide feedback
            const feedbackElement = document.getElementById('feedback');
            feedbackElement.style.display = 'none';
        }}

        function resetExercise() {{
            const inputs = document.querySelectorAll('.fill-blank');
            inputs.forEach(input => {{
                input.value = '';
                input.classList.remove('correct', 'incorrect');
                input.size = Math.max(input.getAttribute('data-original').length, 8);
            }});

            // Hide score and feedback
            document.getElementById('score').style.display = 'none';
            document.getElementById('feedback').style.display = 'none';
        }}
    </script>
</body>
</html>"""
    
    return html_template

def process_html_file(filepath: str) -> None:
    """
    Process a single HTML file and create three fill-in-the-blank versions.
    """
    print(f"Processing {filepath}...")
    
    # Read original file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract lesson name from filename
    lesson_name = os.path.splitext(os.path.basename(filepath))[0]
    
    # Create three versions
    versions = [
        (1, 5, "every_5th"),
        (2, 6, "every_6th"), 
        (3, 7, "every_7th")
    ]
    
    for version_num, nth_word, suffix in versions:
        exercise_html = create_html_exercise(content, lesson_name, version_num, nth_word)
        
        # Create output filename
        output_filename = f"{lesson_name}_exercise_{suffix}.html"
        
        # Write exercise file
        with open(output_filename, 'w', encoding='utf-8') as f:
            f.write(exercise_html)
        
        print(f"  Created: {output_filename}")

def main():
    """
    Main function to process all HTML files in the current directory.
    """
    print("Fill-in-the-blank Exercise Generator")
    print("=" * 40)

    # Find all HTML files that match the lesson pattern but exclude exercise files
    all_html_files = glob.glob("les*.html")
    html_files = [f for f in all_html_files if not f.endswith('_exercise_every_5th.html')
                  and not f.endswith('_exercise_every_6th.html')
                  and not f.endswith('_exercise_every_7th.html')]

    if not html_files:
        print("No lesson HTML files found in current directory.")
        return

    print(f"Found {len(html_files)} original lesson HTML files to process:")
    for file in sorted(html_files):
        print(f"  - {file}")

    print("\nProcessing files...")
    print("-" * 20)

    for filepath in sorted(html_files):
        try:
            process_html_file(filepath)
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

    print("\nProcessing complete!")
    print(f"Generated {len(html_files) * 3} exercise files.")

if __name__ == "__main__":
    main()
