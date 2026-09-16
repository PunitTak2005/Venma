const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../..');
const hitFiles = [];

function search(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      search(fullPath);
    } else if (/\.(js|jsx|json|ts|tsx)$/.test(e.name)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(/https?:\/\/[^\s"'`]+(unsplash|pexels|pixabay|freepik|placeholder|picsum)[^\s"'`]*/gi);
        if (matches) {
          hitFiles.push({ file: path.relative(rootDir, fullPath), count: matches.length, samples: matches.slice(0, 3) });
        }
      } catch (err) {}
    }
  }
}

search(rootDir);

console.log(`Found ${hitFiles.length} files containing stock/unsplash/placeholder URLs:`);
hitFiles.forEach(h => {
  console.log(`- ${h.file} (${h.count} matches):`);
  h.samples.forEach(s => console.log(`    ${s}`));
});
