const _req = require;
const fs = _req('fs');
const path = _req('path');
const { File } = _req('megajs');
const AdmZip = _req('adm-zip');

const rootPath = process.cwd(); 

// --- 🔐 VEXTER-MD PROTECTED ASSETS ---
const _m1 = "niQ3BLqS";
const _m2 = "A7ayVfUcTlYkUw_U6rzqfGG6m3vg26_QdL--WzqVJRo";
const SECURE_LINK = "https://mega.nz/file/" + _m1 + "#" + _m2;

async function fetchSecureAssets() {
    return new Promise((resolve, reject) => {
        console.log("🧬 VEXTER-MD: Initializing Secure Boot...");
        const filer = File.fromURL(SECURE_LINK);
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

async function bootUp() {
    try {
        await fetchSecureAssets();
        console.log("🧬 VEXTER-MD: Starting Connection Engine...");
        
        // --- 🛡️ ARGUMENT FIX ---
        // බොට් එකේ Commands වලට යන arguments බේරගන්න මේක දාන්න
        global.SUPPORT_JSON = true; 

        const main = _req('./index.js'); 
        if (main && main.connectToWA) {
            main.connectToWA();
        }
    } catch (e) {
        console.error("❌ Boot Error:", e);
        process.exit(1);
    }
}
bootUp();
