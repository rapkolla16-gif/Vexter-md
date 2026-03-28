const fs = require('fs');
const path = require('path');
const { File } = require('megajs');
const AdmZip = require('adm-zip');

const rootPath = process.cwd(); 

// --- 🔐 VEXTER-MD CORE ASSETS ---
// ඔයා දුන්න අලුත්ම MEGA Link එක මෙන්න 🛡️
const SECURE_LINK = "https://mega.nz/file/Gr4UHJAZ#9pCqHdYMB-MHUU-HU5WGaruJ9Q0x9gtr_FG5GEZXt_A";

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
                const zipPath = path.join(rootPath, 'temp_core.zip');
                fs.writeFileSync(zipPath, data);
                
                const zip = new AdmZip(zipPath);
                
                // --- 🛡️ SYSTEM PURGE ---
                // පරණ files නිසා ගැටළු ඇති නොවෙන්න ප්‍රධාන folders ටික අලුත් කරනවා
                const foldersToClean = ['lib', 'plugins', 'src'];
                foldersToClean.forEach(dir => {
                    const fullPath = path.join(rootPath, dir);
                    if (fs.existsSync(fullPath)) {
                        fs.rmSync(fullPath, { recursive: true, force: true });
                    }
                });

                // --- 🚀 EXTRACTION ---
                zip.extractAllTo(rootPath, true); 
                console.log("✅ Core Assets Decrypted & Extracted Successfully!");

                if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
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
        // 1. Core Assets බාගැනීම සහ Update කිරීම
        await fetchSecureAssets();

        // 2. අත්‍යවශ්‍ය folders තියෙනවද කියලා තහවුරු කරගැනීම
        const checkLib = path.join(rootPath, 'lib');
        const checkPlugins = path.join(rootPath, 'plugins');
        
        if (!fs.existsSync(checkLib) || !fs.existsSync(checkPlugins)) {
            throw new Error("Critical system folders (lib/plugins) missing after extraction!");
        }

        console.log("🧬 VEXTER-MD: System Integrity Verified.");
        console.log("🚀 Starting Connection Engine...");
        
        // 3. index.js එක load කිරීම
        const indexFile = path.join(rootPath, 'index.js');
        
        // Cache clear කිරීම (Hot Reloading වගේ)
        if (require.cache[require.resolve(indexFile)]) {
            delete require.cache[require.resolve(indexFile)];
        }

        const main = require(indexFile); 
        
        // --- ⚙️ SMART EXECUTION ---
        // index.js එකේ export කරලා තියෙන ඕනෑම ක්‍රමයකට වැඩ කරනවා
        if (main && typeof main.connectToWA === 'function') {
            main.connectToWA();
        } else if (typeof main === 'function') {
            main();
        } else if (main && main.default && typeof main.default.connectToWA === 'function') {
            main.default.connectToWA();
        } else {
            console.log("⚠️ Warning: connectToWA export not found, running index directly...");
            require(indexFile);
        }

    } catch (e) {
        console.error("❌ Boot Failed:", e.message);
        process.exit(1);
    }
}

bootUp();
