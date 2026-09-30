const fs = require('fs');
const mongoose = require('mongoose');

const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

const CaseStudySchema = new mongoose.Schema({ slug: String, sheetData: Object });
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);

async function run() {
  try {
    await mongoose.connect(envVars.MONGODB_URI);
    const studies = await CaseStudy.find({}, 'slug sheetData').lean();
    console.log(`Found ${studies.length} studies.`);

    const GOOGLE_URL = envVars.GOOGLE_SHEET_WEBHOOK_URL; 
    
    for (const study of studies) {
      const payload = {
        slug: study.slug,
        clientName: study.sheetData?.clientName || '',
        skills: study.sheetData?.skills || '',
        techStack: study.sheetData?.techStack || '',
        description: study.sheetData?.description || '',
        link: `https://portfolio.mudassircodes.com/case-study/${study.slug}` // Generate full URL
      };

      await fetch(GOOGLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`Updated link for: ${study.slug}`);
      await new Promise(r => setTimeout(r, 500));
    }
    console.log('🎉 All links updated!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
