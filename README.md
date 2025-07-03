# Fill-in-the-Blank Exercises

A comprehensive web application for interactive Dutch language learning through fill-in-the-blank exercises. Built for GitHub Pages deployment.

## 🌐 Live Demo

Visit the live application: [https://your-username.github.io/fill-in-the-blank-exercises](https://your-username.github.io/fill-in-the-blank-exercises)

> **Note**: Replace `your-username` with your actual GitHub username after forking this repository.

## Features

- 🎯 **Interactive Exercises**: Fill-in-the-blank exercises with real-time validation
- 📚 **Comprehensive Content**: Multiple lessons with varying difficulty levels
- 🔍 **Search & Filter**: Find exercises by title, content, or difficulty
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessible**: Built with accessibility best practices
- 🎨 **Modern UI**: Clean, intuitive interface with custom CSS components
- 📊 **Progress Tracking**: Track your learning progress with localStorage
- ⚡ **Fast Loading**: Static site optimized for GitHub Pages

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Styling**: Custom CSS with modern design patterns
- **Deployment**: GitHub Pages
- **Storage**: Browser localStorage for progress tracking
- **Icons**: SVG icons for lightweight performance

## Getting Started

### For Users

Simply visit the live application at the GitHub Pages URL above. No installation required!

### For Developers

1. Clone the repository:

```bash
git clone <repository-url>
cd fill-in-the-blank-exercises
```

2. Serve the files locally (optional):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Or simply open index.html in your browser
```

3. Open [http://localhost:8000](http://localhost:8000) in your browser.

### GitHub Pages Deployment

1. Fork this repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your site will be available at `https://your-username.github.io/fill-in-the-blank-exercises`

## Project Structure

```
├── index.html              # Main application page
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   │   ├── styles.css     # Main styles
│   │   └── components.css # Component styles
│   ├── js/                # JavaScript files
│   │   ├── main.js        # Main application logic
│   │   ├── data.js        # Data management
│   │   └── utils.js       # Utility functions
│   └── images/            # Images and icons
├── legacy/                # Original HTML exercise files
│   ├── les*.html          # Individual exercise files
│   └── generate_fill_in_blanks.py # Original generator script
└── README.md
```

## Data Storage

The application uses browser localStorage for:

- User progress tracking
- Exercise completion status
- Performance statistics
- User preferences

## Testing

The application includes a comprehensive test suite:

1. Open [http://localhost:8000/tests/test.html](http://localhost:8000/tests/test.html)
2. Run individual test suites or all tests
3. Tests cover:
   - Utility functions
   - Data loading and parsing
   - Search and filtering
   - Accessibility features

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

Quick start:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to GitHub Pages.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Accessibility

This application is built with accessibility in mind:

- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Responsive design for all devices

## License

This project is open source and available under the [MIT License](LICENSE).

## Legacy Files

The `legacy/` directory contains the original HTML exercise files that were used to generate the database content. These files are preserved for reference and can be used to regenerate the exercise data if needed.

## Acknowledgments

- Original exercise content from Dutch language learning materials
- Built with modern web standards for accessibility and performance
- Designed for GitHub Pages deployment
