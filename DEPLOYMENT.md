# Deployment Guide

This guide explains how to deploy the Fill-in-the-Blank Exercises application to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Basic knowledge of Git commands

## Step-by-Step Deployment

### 1. Fork or Clone the Repository

If you haven't already, fork this repository or clone it to your local machine:

```bash
git clone https://github.com/your-username/fill-in-the-blank-exercises.git
cd fill-in-the-blank-exercises
```

### 2. Customize the Application (Optional)

Before deploying, you may want to customize:

- Update the GitHub repository URL in `README.md`
- Modify the footer links in `index.html`
- Add more exercises to `assets/data/exercises.json`
- Customize colors and styling in `assets/css/styles.css`

### 3. Generate Exercise Data (Optional)

If you want to extract data from all HTML files in the legacy folder:

```bash
cd scripts
npm install
node extract-exercise-data.js
```

This will update `assets/data/exercises.json` with all available exercises.

### 4. Test Locally

Before deploying, test the application locally:

```bash
# Start a local server
python3 -m http.server 8000
# or
npx http-server

# Open http://localhost:8000 in your browser
# Run tests at http://localhost:8000/tests/test.html
```

### 5. Commit and Push Changes

```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

### 6. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select "Deploy from a branch"
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 7. Configure Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file to the root directory with your domain name
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable "Enforce HTTPS" in the Pages settings

### 8. Access Your Deployed Site

Your site will be available at:
- `https://your-username.github.io/fill-in-the-blank-exercises`
- Or your custom domain if configured

## Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys changes when you push to the main branch.

## Troubleshooting

### Common Issues

1. **404 Error**: Make sure `index.html` is in the root directory
2. **CSS/JS Not Loading**: Check file paths are relative and correct
3. **Exercises Not Loading**: Verify `assets/data/exercises.json` exists and is valid JSON

### Debugging Steps

1. Check the browser's developer console for errors
2. Verify all file paths are correct and case-sensitive
3. Test locally before deploying
4. Check GitHub Actions logs for deployment errors

### Performance Optimization

1. **Optimize Images**: Compress any images in the `assets/images/` folder
2. **Minify CSS/JS**: Consider minifying files for production
3. **Enable Caching**: GitHub Pages automatically handles caching headers

## Updating Content

### Adding New Exercises

1. Add new HTML files to the `legacy/` folder
2. Run the extraction script to update the JSON data
3. Commit and push changes

### Modifying Existing Exercises

1. Edit the HTML files in the `legacy/` folder
2. Re-run the extraction script
3. Or manually update `assets/data/exercises.json`

### Updating Styles

1. Modify CSS files in `assets/css/`
2. Test changes locally
3. Commit and push

## Security Considerations

- All data is static and client-side only
- No server-side processing or databases
- User progress is stored in browser localStorage
- No sensitive information is transmitted

## Browser Compatibility

The application supports:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Accessibility

The application includes:
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Responsive design for mobile devices

## Monitoring and Analytics

To add analytics:

1. Add Google Analytics or similar tracking code to `index.html`
2. Monitor user interactions and performance
3. Use GitHub's built-in traffic analytics

## Backup and Recovery

- All source code is version controlled in Git
- Exercise data is stored in JSON files
- No database backup required
- User progress is stored locally (not backed up)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the test results at `/tests/test.html`
3. Open an issue on the GitHub repository
4. Check browser developer console for errors
