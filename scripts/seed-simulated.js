const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
global.WebSocket = require('ws');

async function seed() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/SUPABASE_URL=(.*)/)[1].trim();
  const key = env.match(/SUPABASE_SERVICE_KEY=(.*)/)[1].trim();
  
  const supabase = createClient(url, key);

  try {
    // 1. Alter tables to add is_simulated if not exists
    // We cannot easily alter via postgrest, but we can try to insert. If it fails, the column is missing.
    // Actually, let's just use the Supabase SQL REST endpoint if possible? 
    // No, standard JS client doesn't support arbitrary SQL without RPC.
    
    // Create a real referrer first (or use an existing one)
    // We'll create a simulated referrer
    const referrerId = crypto.randomUUID();
    const referrer = {
      id: referrerId,
      name: 'Simulated Referrer',
      phone: '9999900000',
      email: 'simulated_referrer@example.com',
      branch: 'CSE - Computer Science',
      grad_year: 2025,
      slot: 'slot-1',
      consent: true,
      ref_code: 'SIM123',
      is_simulated: true
    };
    
    const { error: refError } = await supabase.from('registrants').insert(referrer);
    if (refError) throw new Error(`Referrer insert failed: ${refError.message}`);
    
    // Create simulated referrals
    const referrals = [];
    let personsInserted = 0;
    
    for (let i = 1; i <= 5; i++) {
      const referredId = crypto.randomUUID();
      const p = {
        id: referredId,
        name: `Simulated Person ${i}`,
        phone: `999990000${i}`,
        email: `simulated${i}@example.com`,
        branch: 'CSE - Computer Science',
        grad_year: 2025,
        slot: 'slot-1',
        consent: true,
        ref_code: `SIMREF${i}`,
        referred_by_code: 'SIM123',
        is_simulated: true
      };
      const { error: pError } = await supabase.from('registrants').insert(p);
      if (pError) throw new Error(`Person ${i} insert failed: ${pError.message}`);
      personsInserted++;
      
      referrals.push({
        referrer_id: referrerId,
        referred_id: referredId,
        is_simulated: true
      });
    }
    
    const { error: relError } = await supabase.from('referrals').insert(referrals);
    if (relError) throw new Error(`Referrals insert failed: ${relError.message}`);
    
    console.log(`Successfully seeded! Inserted 1 referrer, ${personsInserted} referred registrants, and ${referrals.length} referral links.`);
  } catch(e) {
    console.error('Seed error:', e.message);
  }
}

seed();
