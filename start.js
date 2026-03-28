const fs = require('fs');
const path = require('path');
const { File } = require('megajs');
const AdmZip = require('adm-zip');

const rootPath = process.cwd(); 

// --- 🔐 VEXTER-MD SECURE CORE ASSETS ---
// ඔයා දුන්න අලුත්ම MEGA Link එක මෙතන තියෙනවා 🛡️
const SECURE_LINK = "https://mega.nz/file/zmQ2UAwQ#larWXK1F3k-qg63RoU3gv6-GpoC2Eb6-KbtWH6v8SKY";

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
                
                // --- 🛡️ CLEANING OLD SYSTEM FILES ---
                // පරණ ෆයිල් නිසා අවුල් නොවෙන්න මේවා මකලා අලුතින්ම දානවා
                ['lib', 'plugins', 'src'].forEach(dir => {
                    const fullPath = path.join(rootPath, dir);
                    if (fs.existsSync(fullPath)) {
                        fs.rmSync(fullPath, { recursive: true, force: true });
                    }
                });

                // --- 🚀 EXTRACTING NEW ASSETS ---
                zip.extractAllTo(rootPath, true); 
                console.log("✅ Core Assets Decrypted & Extracted!");

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
        // 1. Core Assets බාගැනීම සහ දිගහැරීම
        await fetchSecureAssets();

        // 2. අත්‍යවශ්‍ය folders තියෙනවද කියලා check කිරීම
        if (!fs.existsSync(path.join(rootPath, 'lib')) || !fs.existsSync(path.join(rootPath, 'plugins'))) {
            throw new Error("Critical system folders missing after extraction!");
        }

        console.log("🧬 VEXTER-MD: System Integrity Verified.");
        console.log("🚀 Starting Connection Engine...");
        
        // 3. index.js එක load කිරීම
        const indexFile = path.join(rootPath, 'index.js');
        
        // Cache එක අයින් කරලා අලුතින්ම Load කිරීම 🛡️
        if (require.cache[require.resolve(indexFile)]) {
            delete require.cache[require.resolve(indexFile)];
        }

        const main = require(indexFile); 
        
        // --- ⚙️ SMART LOADER ---
        // index.js එකේ ඕනෑම විදියකට තියෙන function එකක් අල්ලගන්න පුළුවන්
        if (main && typeof main.connectToWA === 'function') {
            main.connectToWA();
        } else if (typeof main === 'function') {
            main();
        } else if (main && main.default && typeof main.default.connectToWA === 'function') {
            main.default.connectToWA();
        } else {
            console.log("⚠️ Warning: connectToWA not exported, running index directly...");
            require(indexFile);
        }

    } catch (e) {
        console.error("❌ Boot Failed:", e.message);
        process.exit(1);
    }
}

bootUp();
