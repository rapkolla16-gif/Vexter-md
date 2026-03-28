const fs = require('fs');
const path = require('path');
const { File } = require('megajs');
const AdmZip = require('adm-zip');

// --- 🛡️ SETUP PATHS ---
// මෙතන කලින් 'const' දෙපාරක් තිබුණ නිසා තමයි Error එක ආවේ. 
const rootPath = process.cwd(); 

// --- 🔐 VEXTER-MD PROTECTED ASSETS ---
const SECURE_MEGA_ID = "niQ3BLqS#A7ayVfUcTlYkUw_U6rzqfGG6m3vg26_QdL--WzqVJRo"; 
const PROTECTED_ALIVE_IMG = "https://i.ibb.co/ZRXhhYxH/db1c9ed7-6513-49da-8105-f21c73583135.png"; 

async function fetchSecureAssets() {
    return new Promise((resolve, reject) => {
        console.log("🧬 VEXTER-MD: Initializing Secure Boot...");
        global.ALIVE_IMG = PROTECTED_ALIVE_IMG;

        const filer = File.fromURL(`https://mega.nz/file/${SECURE_MEGA_ID}`);
        console.log("🔄 Fetching Encrypted Core Assets from MEGA...");

        filer.download((err, data) => {
            if (err) return reject(err);
            try {
                const zipPath = path.join(rootPath, 'temp_core.zip');
                fs.writeFileSync(zipPath, data);
                
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(rootPath, true); 
                
                if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
                console.log("✅ Assets Decrypted & System Ready!");
                resolve();
            } catch (e) { reject(e); }
        });
    });
}

// --- 🚀 BOOT ENGINE ---
async function bootUp() {
    try {
        const libDir = path.join(rootPath, 'lib');
        const pluginsDir = path.join(rootPath, 'plugins');

        [libDir, pluginsDir].forEach(dir => {
            if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
        });

        await fetchSecureAssets();

        console.log("🧬 VEXTER-MD: Starting Connection Engine...");
        
        // 🚨 Main Connection එක Load කිරීම
        const indexFile = path.join(rootPath, 'index.js');
        const { connectToWA } = require(indexFile); 
        if (connectToWA) connectToWA();

    } catch (e) {
        console.error("❌ Boot Error:", e);
        process.exit(1);
    }
}

bootUp();
