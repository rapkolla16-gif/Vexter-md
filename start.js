const fs = require('fs');
const path = require('path');
const { File } = require('megajs');
const AdmZip = require('adm-zip');

const rootPath = process.cwd(); 

// --- 🔐 VEXTER-MD PROTECTED ASSETS ---
const SECURE_MEGA_ID = "niQ3BLqS#A7ayVfUcTlYkUw_U6rzqfGG6m3vg26_QdL--WzqVJRo"; 

async function fetchSecureAssets() {
    return new Promise((resolve, reject) => {
        console.log("🧬 VEXTER-MD: Initializing Secure Boot...");
        
        const filer = File.fromURL(`https://mega.nz/file/${SECURE_MEGA_ID}`);
        console.log("🔄 Fetching Core System from MEGA...");

        filer.download((err, data) => {
            if (err) return reject(err);
            try {
                const zipPath = path.join(rootPath, 'temp_core.zip');
                fs.writeFileSync(zipPath, data);
                
                const zip = new AdmZip(zipPath);
                
                // --- 🛡️ CLEAN OLD FILES BEFORE EXTRACT ---
                ['lib', 'plugins', 'src'].forEach(dir => {
                    const fullPath = path.join(rootPath, dir);
                    if (fs.existsSync(fullPath)) {
                        fs.rmSync(fullPath, { recursive: true, force: true });
                    }
                });

                // --- 🚀 EXTRACTING ---
                zip.extractAllTo(rootPath, true); 
                console.log("✅ Core Assets Extracted Successfully!");

                if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
                resolve();
            } catch (e) { reject(e); }
        });
    });
}

async function bootUp() {
    try {
        // 1. Assets බාගැනීම
        await fetchSecureAssets();

        // 2. Files හරියට තියෙනවද කියලා Check කිරීම
        const libPath = path.join(rootPath, 'lib');
        const pluginsPath = path.join(rootPath, 'plugins');

        if (!fs.existsSync(libPath) || !fs.existsSync(pluginsPath)) {
            throw new Error("❌ System Folders (lib/plugins) missing after extraction!");
        }

        console.log("🧬 VEXTER-MD: System Integrity Verified.");
        console.log("🚀 Starting Connection Engine...");
        
        // 3. Main Connection
        const indexFile = path.join(rootPath, 'index.js');
        
        // පරණ cache අයින් කරලා අලුත් index.js එක load කිරීම
        delete require.cache[require.resolve(indexFile)];
        const main = require(indexFile); 
        
        if (main && main.connectToWA) {
            main.connectToWA();
        } else {
            console.error("❌ Critical: connectToWA function not found in index.js!");
        }

    } catch (e) {
        console.error("❌ Boot Error:", e.message);
        process.exit(1);
    }
}

bootUp();
