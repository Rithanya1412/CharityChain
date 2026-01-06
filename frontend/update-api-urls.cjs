const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has API_URL import
    if (content.includes('import { API_URL }')) {
      console.log(`✓ ${file} already updated`);
      return;
    }
    
    // Check if file has fetch calls
    if (!content.includes("fetch('http://localhost:5000") && 
        !content.includes('fetch("http://localhost:5000') &&
        !content.includes('fetch(`http://localhost:5000')) {
      console.log(`- ${file} has no fetch calls, skipping`);
      return;
    }
    
    // Add import at top (after existing imports)
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertIndex = i + 1;
      }
    }
    
    lines.splice(insertIndex, 0, "import { API_URL } from '../config';");
    content = lines.join('\n');
    
    // Replace all fetch URLs
    content = content.replace(
      /fetch\(['"]http:\/\/localhost:5000/g,
      "fetch(`${API_URL}"
    );
    content = content.replace(
      /fetch\(`http:\/\/localhost:5000/g,
      'fetch(`${API_URL}'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated: ${file}`);
  }
});

console.log('\n✅ All files updated! Now restart your dev server.');