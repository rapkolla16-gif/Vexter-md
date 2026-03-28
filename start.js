const { File } = require('megajs');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// --- 🔐 VEXTER-MD SECURE ASSET ID ---
const SECURE_MEGA_ID = "WzQEXSRD#IUuPJo6vmd9TFMfBp0tB-6oj6zGnhtBsBzthoqIT_QY"; 

async function fetchSecureAssets() {
    return new Promise((resolve, reject) => {
        console.log("🧬 VEXTER-MD: Initializing Secure Boot...");
        
        // Mega Link එකෙන් File එක ගන්නවා
        const filer = File.fromURL(`https://mega.nz/file/${SECURE_MEGA_ID}`);
        
        console.log("🔄 Fetching Encrypted Core Assets (lib/plugins) from MEGA...");

        filer.download((err, data) => {
            if (err) {
                console.error("❌ MEGA Download Error: Please check your link or internet connection.");
                return reject(err);
            }

            try {
                const zipPath = path.join(__dirname, 'temp_core.zip');
                fs.writeFileSync(zipPath, data);

                const zip = new AdmZip(zipPath);
                
                // 📂 Zip එක ඇතුළේ තියෙන lib/ සහ plugins/ folders extract කරනවා
                console.log("📦 Decrypting and extracting folders...");
                zip.extractAllTo(__dirname, true); 
                
                fs.unlinkSync(zipPath); // Zip එක මකනවා
                console.log("✅ Assets Decrypted & System Ready!");
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    });
}

// --- ⚙️ SYSTEM CLEANUP (ZERO FOOTPRINT) ---
function wipeData() {
    console.log("\n🧹 VEXTER-MD: Wiping sensitive data for security...");
    const targets = ['./lib', './plugins'];
    targets.forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath)) {
            try {
                fs.rmSync(dirPath, { recursive: true, force: true });
            } catch (e) {
                // Folder එක දැනටමත් පාවිච්චි වෙනවා නම් මකන්න බැරි වෙන්න පුළුවන්
            }
        }
    });
}

// --- 🚀 MAIN ENGINE START ---
async function bootUp() {
    try {
        // 1. පරණ දත්ත තියෙනවා නම් මුලින්ම පිරිසිදු කරනවා
        wipeData();

        // 2. Mega එකෙන් අලුත්ම Code එක Download කරගන්නවා
        await fetchSecureAssets();

        // 3. දැන් index.js එකෙන් බොට්ව පණ ගන්වනවා
        console.log("🧬 VEXTER-MD: Starting Connection Engine...");
        
        // මතක ඇතුව index.js එකේ අන්තිමට module.exports = { connectToWA }; දාන්න
        const { connectToWA } = require('./index.js'); 
        if (connectToWA) {
            connectToWA();
        } else {
            console.error("❌ Error: connectToWA function not found in index.js");
        }

    } catch (e) {
        console.error("❌ Boot Error:", e);
        wipeData(); 
        process.exit(1);
    }
}

// Exit Cleanup ලොජික් එක
process.on('SIGINT', () => { wipeData(); process.exit(); });
process.on('exit', wipeData);

bootUp();
