const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const readline = require("readline");

// Setup readline to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Helper function to replace './' with '{assetUrl}/' in CSS, JS, and HTML files
function replaceAssetUrls(content) {
  let cacheBusterId = makeid(8);
  return content
    .replace(
      /(href|src)\s*=\s*["']\.\/(.*?)["']/gi,
      `$1="{assetUrl}/$2?v=${cacheBusterId}"`
    )
    .replace(
      /url\(\s*["']\.\/(.*?)["']\s*\)/gi,
      `url("{assetUrl}/$1?v=${cacheBusterId}")`
    );
}

// Function to recursively add files to the archive, modifying relevant files
function addFilesToArchive(archive, dirPath, basePath = "") {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.join(basePath, file);
    const ext = path.extname(file);

    if (fs.statSync(fullPath).isDirectory()) {
      addFilesToArchive(archive, fullPath, relativePath);
    } else if ([".html", ".css", ".js"].includes(ext)) {
      let fileContent = fs.readFileSync(fullPath, "utf8");
      fileContent = replaceAssetUrls(fileContent);
      archive.append(fileContent, { name: relativePath });
    } else {
      archive.file(fullPath, { name: relativePath });
    }
  });
}

// Function to zip the src directory
function createZipFile(outputFilename) {
  const buildDir = path.join(__dirname, "build");
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  const outputFilePath = path.join(buildDir, `${outputFilename}.zip`);
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  output.on("close", () => {
    console.log(
      `Zipped ${archive.pointer()} total bytes into ${outputFilePath}.`
    );
    rl.close();
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  // Recursively add all files and directories from the src directory to the archive
  addFilesToArchive(archive, path.join(__dirname, "src"));

  archive.finalize();
}

// Ask the user for the filename
rl.question(
  "Enter the name of the output zip file (without extension): ",
  (filename) => {
    if (filename.trim()) {
      createZipFile(filename.trim());
    } else {
      console.log("Invalid filename. Please try again.");
      rl.close();
    }
  }
);
