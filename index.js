const express = require('express');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const PORT = process.env.PORT || 3000;


// Setup livereload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'src'));

// Enable liveReload middleware
app.use(connectLivereload());

// Helper function to update URLs in <link> and <script> tags to point to /assets
function updateAssetUrls(element, srcFolderPath) {
    if (element.tagName === 'LINK' && element.getAttribute('rel') === 'stylesheet') {
        let href = element.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('/')) {
            const absolutePath = path.resolve(srcFolderPath, href);
            const relativePath = path.relative(srcFolderPath, absolutePath);
            element.setAttribute('href', relativePath.replace(/\\/g, '/'));
        }
    } else if (element.tagName === 'SCRIPT') {
        let src = element.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
            const absolutePath = path.resolve(srcFolderPath, src);
            const relativePath = path.relative(srcFolderPath, absolutePath);
            element.setAttribute('src', relativePath.replace(/\\/g, '/'));
        }
    }
}

// Function to merge HTML files and inject updated <link> and <script> tags
function mergeHTMLFiles(templatePath, contentPath, templateAssetsPath, callback) {
    fs.readFile(templatePath, 'utf8', (err, templateData) => {
        if (err) return callback(err);

        fs.readFile(contentPath, 'utf8', (err, contentData) => {
            if (err) return callback(err);

            // Parse the main HTML to extract the head and body content
            const dom = new JSDOM(contentData);
            const bodyContent = dom.window.document.body.innerHTML;
            const headElements = dom.window.document.head.children;
            const pageTitle = dom.window.document.title;

            // Parse the template HTML
            const templateDom = new JSDOM(templateData);
            const templateHead = templateDom.window.document.head;

            const templateTitleElement = templateDom.window.document.querySelector('title');
            if (templateTitleElement) {
                templateTitleElement.textContent = pageTitle;
            } else {
                // If there's no <title> in the template, create one
                const newTitleElement = templateDom.window.document.createElement('title');
                newTitleElement.textContent = pageTitle;
                templateHead.appendChild(newTitleElement);
            }

            // Process and insert each <link> and <script> element from the main HTML
            Array.from(headElements).forEach((element) => {
                updateAssetUrls(element, path.dirname(contentPath)); // Update URLs to point to /assets
                templateHead.appendChild(element.cloneNode(true));
            });

            // Include assets from the template/assets folder only
            // const assetFiles = getAssetFiles(templateAssetsPath);

            // // Add CSS and JS from template/assets to the template's head
            // assetFiles.forEach(assetFile => {
            //     const relativeAssetPath = path.relative(path.join(__dirname, 'template'), assetFile);
            //     if (assetFile.endsWith('.css')) {
            //         const linkElement = templateDom.window.document.createElement('link');
            //         linkElement.rel = 'stylesheet';
            //         linkElement.href = relativeAssetPath.replace(/\\/g, '/'); // Replace backslashes with forward slashes for URLs
            //         templateHead.appendChild(linkElement);
            //     } else if (assetFile.endsWith('.js')) {
            //         const scriptElement = templateDom.window.document.createElement('script');
            //         scriptElement.src = relativeAssetPath.replace(/\\/g, '/'); // Replace backslashes with forward slashes for URLs
            //         templateHead.appendChild(scriptElement);
            //     }
            // });

            // Insert the body content into the template
            templateDom.window.document.body.innerHTML = templateDom.window.document.body.innerHTML.replace('<!-- CONTENT -->', bodyContent);

            // Serialize the final HTML
            const mergedHTML = templateDom.serialize();
            callback(null, mergedHTML);
        });
    });
}

// Helper function to recursively get all CSS and JS files from a directory
function getAssetFiles(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAssetFiles(filePath, fileList);
        } else if (file.endsWith('.css') || file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Route to serve the merged HTML based on the URL path
app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    const templatePath = path.join(__dirname, 'template', 'template.html');
    const contentPath = path.join(__dirname, 'src', `${pageName}.html`);
    //const templateAssetsPath = path.join(__dirname, 'template', 'assets');

    // Check if the requested HTML file exists
    if (!fs.existsSync(contentPath)) {
        res.status(404).send('Page not found');
        return;
    }

      // Check if the raw query string parameter is present
      if (req.query.raw === 'true') {
        // Serve the src HTML file directly without merging with the template
        res.sendFile(contentPath);
        return;
    }

    mergeHTMLFiles(templatePath, contentPath, null, (err, mergedHTML) => {
        if (err) {
            res.status(500).send('Error merging HTML files');
            return;
        }
        res.send(mergedHTML);
    });
});

// Serve static files (CSS/JS) from both the src/assets and template/assets folders
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'template', 'assets')));

// Default route to handle the home page or unspecified routes
app.get('/', (req, res) => {
    res.redirect('/index'); // Redirect to the "index.html" by default
});

// Notify livereload of changes and reload the current page
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
