const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
const outputPath = path.join(__dirname, 'src', 'assets', 'iconsMapping.ts');

fs.readdir(iconsDir, (err, files) => {
  if (err) {
    console.error('Failed to read icons directory', err);
    return;
  }

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

  fs.writeFile(outputPath, content, (err) => {
    if (err) {
      console.error('Failed to write icons mapping file', err);
      return;
    }
    console.log('Icons mapping module generated successfully');
  });
});
