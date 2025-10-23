#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Link Saver Extension...\n');

let hasErrors = false;

// Check manifest.json
console.log('📄 Checking manifest.json...');
try {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  
  const requiredFields = ['name', 'version', 'manifest_version', 'permissions', 'action', 'background', 'icons'];
  requiredFields.forEach(field => {
    if (!manifest[field]) {
      console.error(`  ❌ Missing required field: ${field}`);
      hasErrors = true;
    }
  });
  
  if (manifest.manifest_version !== 3) {
    console.error('  ❌ Manifest version should be 3');
    hasErrors = true;
  }
  
  if (!hasErrors) {
    console.log('  ✅ Manifest is valid');
  }
} catch (error) {
  console.error(`  ❌ Error reading manifest.json: ${error.message}`);
  hasErrors = true;
}

// Check required files
console.log('\n📂 Checking required files...');
const requiredFiles = [
  'background.js',
  'db.js',
  'popup.html',
  'popup.css',
  'popup.js',
  'options.html',
  'options.css',
  'options.js',
  'icons/icon16.png',
  'icons/icon48.png',
  'icons/icon128.png',
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.error(`  ❌ Missing: ${file}`);
    hasErrors = true;
  }
});

// Check for common issues in JavaScript files
console.log('\n🔧 Checking JavaScript files...');
const jsFiles = ['background.js', 'db.js', 'popup.js', 'options.js'];
jsFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for console.log (warnings only)
    const consoleLogs = (content.match(/console\.log/g) || []).length;
    if (consoleLogs > 0) {
      console.log(`  ⚠️  ${file} contains ${consoleLogs} console.log statement(s)`);
    }
    
    console.log(`  ✅ ${file} looks good`);
  } catch (error) {
    console.error(`  ❌ Error reading ${file}: ${error.message}`);
    hasErrors = true;
  }
});

// Check HTML files
console.log('\n📝 Checking HTML files...');
const htmlFiles = ['popup.html', 'options.html'];
htmlFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    const checks = {
      'DOCTYPE': content.includes('<!DOCTYPE html>'),
      'html tag': content.includes('<html'),
      'charset': content.includes('charset'),
    };
    
    const allChecks = Object.values(checks).every(v => v);
    if (allChecks) {
      console.log(`  ✅ ${file}`);
    } else {
      console.error(`  ❌ ${file} has issues:`, Object.entries(checks).filter(([k,v]) => !v).map(([k]) => k).join(', '));
      hasErrors = true;
    }
  } catch (error) {
    console.error(`  ❌ Error reading ${file}: ${error.message}`);
    hasErrors = true;
  }
});

// Check dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const nodeModules = fs.existsSync('node_modules');
  
  if (!nodeModules) {
    console.error('  ❌ node_modules not found. Run: npm install');
    hasErrors = true;
  } else {
    console.log('  ✅ Dependencies installed');
  }
  
  // Check if Dexie is available
  if (fs.existsSync('node_modules/dexie/dist/dexie.min.js')) {
    console.log('  ✅ Dexie library found');
  } else {
    console.error('  ❌ Dexie library not found');
    hasErrors = true;
  }
} catch (error) {
  console.error(`  ❌ Error checking dependencies: ${error.message}`);
  hasErrors = true;
}

// Final result
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('❌ Validation failed! Please fix the errors above.');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Extension is ready to load.');
  console.log('\nNext steps:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked" and select this directory');
  process.exit(0);
}
