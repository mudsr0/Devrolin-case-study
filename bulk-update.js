const fs = require('fs');
const mongoose = require('mongoose');

// Manually read .env file
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

// 1. Basic Mongoose Schema (just what we need for this update)
const CaseStudySchema = new mongoose.Schema({
    slug: String,
    sheetData: {
        clientName: String,
        skills: String,
        techStack: String,
        description: String
    }
});
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);

async function run() {
    try {
        // 2. Connect to DB
        await mongoose.connect(envVars.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 3. Read JSON file
        const rawData = fs.readFileSync('sheet-data.json', 'utf8');
        const projects = JSON.parse(rawData);
        console.log(`📊 Found ${projects.length} projects to update.`);

        // 4. Loop through and update DB + push to Google Sheet
        for (const project of projects) {
            // Update MongoDB
            await CaseStudy.updateOne(
                { slug: project.slug },
                {
                    $set: {
                        sheetData: {
                            clientName: project.clientName,
                            skills: project.skills,
                            techStack: project.techStack,
                            description: project.description
                        }
                    }
                }
            );
            console.log(`📝 Updated DB for: ${project.slug}`);

            // Push to Google Sheet
            const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbzfO64EY2PJo7yOQ21FZ_uTW3c_xKhlIa1sZ-ei8DyjYg5Kh2_sWIixwl6vuN5nzHq8/exec";
            if (GOOGLE_URL) {
                await fetch(GOOGLE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...project })
                });
                console.log(`📤 Pushed to Google Sheet: ${project.slug}`);
            }

            // Wait 500ms to avoid Google rate limits
            await new Promise(r => setTimeout(r, 500));
        }

        console.log('🎉 All done! You can now delete bulk-update.js and sheet-data.json');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

run();