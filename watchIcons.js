const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const debounce = require('lodash.debounce');

const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
const outputPath = path.join(__dirname, 'src', 'assets', 'iconsMapping.ts');

function generateIconsMapping() {
  const files = fs.readdirSync(iconsDir);

  const imports = [];
  const mappings = [];

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      return; 
    }
    const label = path.basename(file, path.extname(file));
    const importName = label.replace(/[^a-zA-Z0-9]/g, '_');
    imports.push(`import ${importName} from './icons/${file}';`);
    mappings.push(`  '${label}': ${importName},`);
  });

  const content = `
${imports.join('\n')}

const icons: Record<string, string> = {
${mappings.join('\n')}
};

export default icons;
`;

  fs.writeFileSync(outputPath, content);
//   console.log('Icons mapping module generated successfully');
}

const debouncedGenerateIconsMapping = debounce(() => {
  generateIconsMapping();
//   clearRequireCache(outputPath);
});

// function clearRequireCache(modulePath) {
//   const resolvedPath = require.resolve(modulePath);
//   if (require.cache[resolvedPath]) {
//     delete require.cache[resolvedPath];
//     console.log('Require cache cleared for', modulePath);
//   }
// }

generateIconsMapping();

chokidar.watch(iconsDir).on('all', (event, path) => {
//   console.log(`Detected ${event} on ${path}. Regenerating icons mapping...`);
  debouncedGenerateIconsMapping();
});
