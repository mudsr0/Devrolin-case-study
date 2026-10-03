const mongoose = require('mongoose');

// --- CONFIGURATION ---
const MUDASSIR_DB_URI = "mongodb+srv://ahmad_devrolin:oBEXsYe9g5tuj5K3@cluster0.bddwdpv.mongodb.net/devrolin-case-study?retryWrites=true&w=majority&appName=Cluster0";
const NASIR_DB_URI = "mongodb+srv://ahmad_devrolin:oBEXsYe9g5tuj5K3@cluster0.bddwdpv.mongodb.net/nasir-case-study?retryWrites=true&w=majority&appName=Cluster0";
const NASIR_SHEET_URL = "https://script.google.com/macros/s/AKfycbwfxWYuRrcIXlmfELB-m_LdVSuJ6x6DbHK1lmKPVdxrg62fNypHrX_PHpNa3xIuaFl_Yg/exec";
const NASIR_DOMAIN = "https://portfolionasirtauqeer-rose.vercel.app";
// ---------------------

const CaseStudySchema = new mongoose.Schema({}, { strict: false, collection: 'casestudies' });

async function run() {
  try {
    // 1. Connect to both databases simultaneously
    const mudassirConn = await mongoose.createConnection(MUDASSIR_DB_URI);
    const nasirConn = await mongoose.createConnection(NASIR_DB_URI);
    
    const MudassirCaseStudy = mudassirConn.model('CaseStudy', CaseStudySchema);
    const NasirCaseStudy = nasirConn.model('CaseStudy', CaseStudySchema);

    console.log('✅ Connected to both databases');
    
    // 2. Fetch all case studies from Mudassir's DB
    const studies = await MudassirCaseStudy.find({}).lean();
    console.log(`📊 Found ${studies.length} case studies to transfer.`);

    // 3. Clear Nasir's DB so we don't create duplicates if run multiple times
    await NasirCaseStudy.deleteMany({});
    console.log('🧹 Cleared existing case studies in Nasir\'s DB.');

    // 4. Loop, Replace, Insert, and Push to Sheet
    for (let study of studies) {
      // Convert to string to replace text everywhere, then back to object
      let studyStr = JSON.stringify(study);
      studyStr = studyStr.split("Mudassir Hussain").join("Nasir Tauqeer");
      studyStr = studyStr.split("mudassir@devrolin.com").join("nasirdevrolin@gmail.com");
      studyStr = studyStr.split("Mudassir H.").join("Nasir T.");
      studyStr = studyStr.split("Mudassir").join("Nasir"); 
      
      let newStudy = JSON.parse(studyStr);
      delete newStudy._id; // Remove old ID so Mongo creates a fresh one

      // Insert into Nasir's DB
      const savedStudy = await NasirCaseStudy.create(newStudy);
      console.log(`✅ Inserted into DB: ${savedStudy.slug}`);

      // Push to Nasir's Google Sheet
      if (NASIR_SHEET_URL) {
        const payload = {
          slug: savedStudy.slug,
          clientName: savedStudy.sheetData?.clientName || savedStudy.clientName || '',
          skills: savedStudy.sheetData?.skills || '',
          techStack: savedStudy.sheetData?.techStack || '',
          description: savedStudy.sheetData?.description || '',
          link: `${NASIR_DOMAIN}/case-study/${savedStudy.slug}`
        };

        await fetch(NASIR_SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log(`📤 Pushed to Sheet: ${savedStudy.slug}`);
      }
      
      // Wait 500ms to avoid Google rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('🎉 Transfer complete!');
    await mudassirConn.close();
    await nasirConn.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

run();