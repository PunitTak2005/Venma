const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, '../../client/public/generated-products');

function getFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(getFiles(full));
    else files.push(full);
  }
  return files;
}

const allFiles = getFiles(baseDir);
console.log(`Found ${allFiles.length} files in ${baseDir}`);

const hashes = {};
allFiles.forEach(f => {
  const buf = fs.readFileSync(f);
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  if (!hashes[hash]) hashes[hash] = [];
  hashes[hash].push(path.relative(baseDir, f));
});

const uniqueCount = Object.keys(hashes).length;
console.log(`Total unique image file contents (by MD5): ${uniqueCount}`);

const duplicates = Object.entries(hashes).filter(([h, list]) => list.length > 1);
console.log(`Duplicate content groups: ${duplicates.length}`);

duplicates.forEach(([h, list]) => {
  console.log(`- Hash ${h} (${list.length} files):`);
  list.slice(0, 5).forEach(f => console.log(`    ${f}`));
  if (list.length > 5) console.log(`    ... and ${list.length - 5} more`);
});
