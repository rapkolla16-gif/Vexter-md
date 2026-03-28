const { File } = require('megajs');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// --- 🔐 VEXTER-MD PROTECTED ASSETS ---
const SECURE_MEGA_ID = "WzQEXSRD#IUuPJo6vmd9TFMfBp0tB-6oj6zGnhtBsBzthoqIT_QY"; 

// 🚫 මේක තමයි ලොක් කරපු ඉමේජ් එක. මේක වෙනස් කරන්න බෑ.
const PROTECTED_ALIVE_IMG = "https://i.ibb.co/xxxxx/DEXTER-OFFICIAL.jpg"; 

async function fetchSecureAssets() {
    return new Promise((resolve, reject) => {
        console.log("🧬 VEXTER-MD: Initializing Secure Boot...");
        
        // ලෝකෙටම පේන්න Global Variable එකක් විදියට ප්ලගින්ස් වලට දෙනවා
        global.ALIVE_IMG = PROTECTED_ALIVE_IMG;

        const filer = File.fromURL(`https://mega.nz/file/${SECURE_MEGA_ID}`);
        console.log("🔄 Fetching Encrypted Core Assets from MEGA...");

        filer.download((err, data) => {
            if (err) return reject(err);
            try {
                const zipPath = path.join(__dirname, 'temp_core.zip');
                fs.writeFileSync(zipPath, data);
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(__dirname, true); 
                fs.unlinkSync(zipPath);
                console.log("✅ Assets Decrypted & System Ready!");
                resolve();
            } catch (e) { reject(e); }
        });
    });
}

// --- 🚀 BOOT ENGINE ---
async function bootUp() {
    try {
        const targets = ['./lib', './plugins'];
        targets.forEach(dir => { if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); });

        await fetchSecureAssets();

        // 🛡️ LOCK LOGIC: වෙන කවුරුහරි Config එකෙන් මේක වෙනස් කරන්න හැදුවොත් ආපහු Force කරනවා.
        const config = require('./config');
        config.ALIVE_IMG = PROTECTED_ALIVE_IMG; 

        console.log("🧬 VEXTER-MD: Starting Connection Engine...");
        const { connectToWA } = require('./index.js'); 
        if (connectToWA) connectToWA();

    } catch (e) {
        console.error("❌ Boot Error:", e);
        process.exit(1);
    }
}

bootUp();
