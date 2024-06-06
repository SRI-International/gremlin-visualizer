const fs = require('fs');
const path = require('path');

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
  // console.log('Icons mapping module generated successfully');
}

// Initial generation of the icons mapping
generateIconsMapping();
