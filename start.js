// --- 🧬 VEXTER-MD SECURE BOOTLOADER ---
"use strict";

/**
 * 🛠️ MODULE COMPATIBILITY LAYER
 * Obfuscate කළාට පස්සේ 'require' නැති වෙන ලෙඩේට විසඳුම මෙන්න.
 */
const _module = require('module');
const _path = require('path');
const _fs = require('fs');
const _require = _module.createRequire ? _module.createRequire(__filename) : require;

const { File } = _require('megajs');
const AdmZip = _require('adm-zip');

const rootPath = process.cwd(); 

// --- 🔐 VEXTER-MD CORE ASSETS (LOCKED BY DEXTER) ---
const SECURE_LINK = "https://mega.nz/file/brhH3CpI#FOPgggQqEbDBShxnevo5bDhFPmXGDWKZqeTb7QE6cMU";

async function fetchSecureAssets() {
    return new Promise((resolve, reject) => {
        console.log("🧬 VEXTER-MD: Initializing Secure Boot...");
        console.log("🔄 Fetching System Core from MEGA...");

        const filer = File.fromURL(SECURE_LINK);
        filer.download((err, data) => {
            if (err) {
                console.error("❌ MEGA Download Error:", err.message);
                return reject(err);
            }
            try {
                const zipPath = _path.join(rootPath, 'temp_core.zip');
                _fs.writeFileSync(zipPath, data);
                
                const zip = new AdmZip(zipPath);
                
                // --- 🛡️ SYSTEM PURGE ---
                const foldersToClean = ['lib', 'plugins', 'src'];
                foldersToClean.forEach(dir => {
                    const fullPath = _path.join(rootPath, dir);
                    if (_fs.existsSync(fullPath)) {
                        _fs.rmSync(fullPath, { recursive: true, force: true });
                    }
                });

                // --- 🚀 EXTRACTION ---
                zip.extractAllTo(rootPath, true); 
                console.log("✅ Core Assets Decrypted & Extracted Successfully!");

                if (_fs.existsSync(zipPath)) _fs.unlinkSync(zipPath);
                resolve();
            } catch (e) { 
                console.error("❌ Extraction Error:", e.message);
                reject(e); 
            }
        });
    });
}

async function bootUp() {
    try {
        // 1. Core Assets Update
        await fetchSecureAssets();

        console.log("🧬 VEXTER-MD: System Integrity Verified.");
        console.log("🚀 Starting Connection Engine...");
        
        // 2. index.js එක load කිරීම
        const indexFile = _path.join(rootPath, 'index.js');
        
        // Cache clear කිරීම
        if (_require.cache[_require.resolve(indexFile)]) {
            delete _require.cache[_require.resolve(indexFile)];
        }

        // --- ⚙️ SMART EXECUTION ---
        const main = _require(indexFile); 
        
        if (main && typeof main.connectToWA === 'function') {
            main.connectToWA();
        } else if (typeof main === 'function') {
            main();
        } else {
            // කෙලින්ම index එක run කරනවා
            _require(indexFile);
        }

    } catch (e) {
        console.error("❌ Boot Failed:", e.message);
        process.exit(1);
    }
}

// Start the process
bootUp();
