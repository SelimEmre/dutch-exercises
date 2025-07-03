# Contributing to Fill-in-the-Blank Exercises

Thank you for your interest in contributing to this project! This document provides guidelines for contributing to the Fill-in-the-Blank Exercises application.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion for improvement:

1. Check if the issue already exists in the [Issues](https://github.com/your-username/fill-in-the-blank-exercises/issues) section
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Browser and device information
   - Screenshots if applicable

### Suggesting Features

For new feature suggestions:

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Explain how it fits with the project's goals
4. Provide mockups or examples if possible

### Code Contributions

#### Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/fill-in-the-blank-exercises.git
cd fill-in-the-blank-exercises

# Create a new branch
git checkout -b feature/your-feature-name

# Start local development server
python3 -m http.server 8000
# Open http://localhost:8000
```

#### Code Style Guidelines

**HTML:**
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Maintain consistent indentation (2 spaces)
- Use lowercase for element names and attributes

**CSS:**
- Follow BEM methodology for class naming
- Use CSS custom properties (variables) for colors and spacing
- Write mobile-first responsive CSS
- Group related properties together
- Include comments for complex styles

**JavaScript:**
- Use ES6+ features where appropriate
- Follow consistent naming conventions (camelCase)
- Include JSDoc comments for functions
- Handle errors gracefully
- Write pure functions when possible

#### File Structure

```
├── index.html              # Main application page
├── assets/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── data/              # JSON data files
├── legacy/                # Original HTML exercises
├── tests/                 # Test files
├── scripts/               # Build/utility scripts
└── docs/                  # Documentation
```

#### Testing

Before submitting a pull request:

1. Test your changes locally
2. Run the test suite at `/tests/test.html`
3. Test on multiple browsers and devices
4. Verify accessibility with screen readers
5. Check responsive design on different screen sizes

#### Accessibility Requirements

All contributions must maintain accessibility standards:

- Include proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers
- Support high contrast mode
- Include focus indicators

### Types of Contributions

#### Adding New Exercises

1. Create HTML files in the `legacy/` folder following the existing format
2. Run the extraction script to update JSON data
3. Test the new exercises thoroughly
4. Update documentation if needed

#### Improving UI/UX

1. Follow the existing design patterns
2. Ensure changes are responsive
3. Maintain accessibility standards
4. Test across different browsers

#### Bug Fixes

1. Identify the root cause
2. Write a test that reproduces the bug
3. Fix the issue
4. Verify the test passes
5. Check for any side effects

#### Documentation

1. Keep documentation up to date
2. Use clear, concise language
3. Include examples where helpful
4. Update README.md if needed

### Pull Request Process

1. **Create a descriptive title** that summarizes the changes
2. **Fill out the PR template** with:
   - Description of changes
   - Type of change (bug fix, feature, etc.)
   - Testing performed
   - Screenshots (if applicable)
3. **Link related issues** using keywords like "Fixes #123"
4. **Request review** from maintainers
5. **Address feedback** promptly and professionally

### Code Review Guidelines

#### For Contributors

- Be open to feedback and suggestions
- Respond to comments in a timely manner
- Make requested changes or explain why you disagree
- Keep discussions focused on the code, not personal

#### For Reviewers

- Be constructive and specific in feedback
- Explain the reasoning behind suggestions
- Acknowledge good practices and improvements
- Focus on code quality, not personal preferences

### Commit Message Guidelines

Use clear, descriptive commit messages:

```
type(scope): brief description

Longer explanation if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(search): add search highlighting functionality
fix(accessibility): improve keyboard navigation
docs(readme): update installation instructions
```

### Community Guidelines

- Be respectful and inclusive
- Help newcomers get started
- Share knowledge and best practices
- Give credit where it's due
- Follow the project's code of conduct

### Getting Help

If you need help:

1. Check the documentation and README
2. Look through existing issues and discussions
3. Ask questions in issue comments
4. Reach out to maintainers

### Recognition

Contributors will be recognized in:
- The project's README file
- Release notes for significant contributions
- GitHub's contributor statistics

Thank you for contributing to make this project better for everyone!
