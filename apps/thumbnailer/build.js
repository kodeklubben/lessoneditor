const fs = require('fs');
const path = require('path');

try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const distPackageJsonPath = path.join(process.cwd(), 'dist', 'apps', 'thumbnailer', 'package.json');
  const distPackageJsonContent = {
    name: 'thumbnailer',
    main: 'main.js',
    dependencies: {},
  };
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  const dependenciesThatShouldBeCopied = [
    'puppeteer', 'tslib',
  ];
  dependenciesThatShouldBeCopied.forEach(dependency => {
    if (packageJson.devDependencies[dependency]) {
      distPackageJsonContent.dependencies[dependency] = packageJson.devDependencies[dependency];
    }
    if (packageJson.dependencies[dependency]) {
      distPackageJsonContent.dependencies[dependency] = packageJson.dependencies[dependency];
    }
  });
  fs.writeFileSync(distPackageJsonPath, JSON.stringify(distPackageJsonContent));
  console.log('Wrote package.json to thumbnailer outputfolder');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}





