// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');
const { FileStore } = require('metro-cache');

const config = getDefaultConfig(__dirname);

// Use a stable on-disk store (shared across web/android)
const root = process.env.METRO_CACHE_ROOT || path.join(__dirname, '.metro-cache');
config.cacheStores = [
  new FileStore({ root: path.join(root, 'cache') }),
];


// Mock expo-keep-awake (native module unavailable in dev)
const keepAwakeMockPath = path.join(__dirname, 'node_modules', 'expo-keep-awake', 'mock.js');
const origResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (ctx, moduleName, platform) => {
  if (moduleName === 'expo-keep-awake') {
    return { type: 'sourceFile', filePath: keepAwakeMockPath };
  }
  if (moduleName.startsWith('expo-keep-awake/')) {
    const subPath = moduleName.slice('expo-keep-awake/'.length);
    return { type: 'sourceFile', filePath: path.join(__dirname, 'node_modules', 'expo-keep-awake', subPath) };
  }
  return origResolveRequest ? origResolveRequest(ctx, moduleName, platform) : ctx.resolveRequest(ctx, moduleName, platform);
};

// // Exclude unnecessary directories from file watching
// config.watchFolders = [__dirname];
// config.resolver.blacklistRE = /(.*)\/(__tests__|android|ios|build|dist|.git|node_modules\/.*\/android|node_modules\/.*\/ios|node_modules\/.*\/windows|node_modules\/.*\/macos)(\/.*)?$/;

// // Alternative: use a more aggressive exclusion pattern
// config.resolver.blacklistRE = /node_modules\/.*\/(android|ios|windows|macos|__tests__|\.git|.*\.android\.js|.*\.ios\.js)$/;

// Reduce the number of workers to decrease resource usage
config.maxWorkers = 2;

module.exports = config;
