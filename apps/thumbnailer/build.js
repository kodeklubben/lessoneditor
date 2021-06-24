const fs = require('fs');
const path = require('path');
const copyPackageJson = (name, dependenciesThatShouldBeCopied) => {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const distPackageJsonPath = path.join(process.cwd(), 'dist', 'apps', name, 'package.json');
    const distPackageJsonContent = {
      name: name,
      main: 'main.js',
      dependencies: {},
    };
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    dependenciesThatShouldBeCopied.forEach(dependency => {
      if (packageJson.devDependencies[dependency]) {
        distPackageJsonContent.dependencies[dependency] = packageJson.devDependencies[dependency];
      }
      if (packageJson.dependencies[dependency]) {
        distPackageJsonContent.dependencies[dependency] = packageJson.dependencies[dependency];
      }
    });
    fs.writeFileSync(distPackageJsonPath, JSON.stringify(distPackageJsonContent));
    console.log('Created package.json in the ' + name + ' outputfolder');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

copyPackageJson('thumbnailer', ['puppeteer', 'tslib']);




