const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import at top if not exists
    if (!content.includes('import { API_URL }')) {
      content = `import { API_URL } from '../config';\n` + content;
    }
    
    // Replace all fetch URLs
    content = content.replace(
      /fetch\(['"]http:\/\/localhost:5000/g,
      "fetch(`${API_URL}"
    );
    content = content.replace(
      /fetch\("http:\/\/localhost:5000/g,
      'fetch(`${API_URL}'
    );
    content = content.replace(
      /fetch\('http:\/\/localhost:5000/g,
      'fetch(`${API_URL}'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  }
});

console.log('All files updated!');