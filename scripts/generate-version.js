#!/usr/bin/env node

/**
 * Script to generate version information during build
 * This ensures that the version info is available at build time
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

function getGitCommitHash() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.warn('Could not get Git commit hash:', error.message);
    return 'unknown';
  }
}

function getPackageVersion() {
  try {
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || '0.0.1';
  } catch (error) {
    console.warn('Could not read package.json:', error.message);
    return '0.0.1';
  }
}

function generateVersionFile() {
  const commitHash = getGitCommitHash();
  const shortCommitHash = commitHash.substring(0, 7);
  const version = getPackageVersion();
  const buildDate = new Date().toISOString();

  const versionInfo = {
    commitHash,
    shortCommitHash,
    version,
    buildDate,
    isDevelopment: process.env.NODE_ENV === 'development'
  };

  const outputPath = path.join(rootDir, 'src', 'lib', 'version-static.ts');
  
  const content = `
// Auto-generated version information - DO NOT EDIT
// Generated at: ${new Date().toISOString()}

export interface VersionInfo {
  commitHash: string;
  shortCommitHash: string;
  version: string;
  buildDate: string;
  isDevelopment: boolean;
}

export const versionInfo: VersionInfo = ${JSON.stringify(versionInfo, null, 2)};
`;

  writeFileSync(outputPath, content);
  console.log('✅ Version information generated successfully');
  console.log(`   Version: ${version}`);
  console.log(`   Commit: ${shortCommitHash}`);
  console.log(`   Build Date: ${buildDate}`);
}

// Run the generation
generateVersionFile();