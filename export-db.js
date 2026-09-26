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

const CaseStudySchema = new mongoose.Schema({}, { strict: false });
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);

async function run() {
  try {
    await mongoose.connect(envVars.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Fetch all case studies, but only grab the fields we need
    const studies = await CaseStudy.find({}, 'slug clientName category hero.body built.items').lean();
    
    // Save to a file
    fs.writeFileSync('current-db.json', JSON.stringify(studies, null, 2));
    console.log(`✅ Exported ${studies.length} case studies to current-db.json`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();