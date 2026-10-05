import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    executablePath: 'C:\\Users\\ksree\\.cache\\puppeteer\\chrome\\win64-154.0.8037.57\\chrome-win64\\chrome.exe' 
  });
  const page = await browser.newPage();
  
  // 1. Load the page with the referral code
  await page.goto('http://localhost:3000/?ref=TUHNCH', { waitUntil: 'networkidle0' });
  
  // 2. Click "Register Now" to go to the form (if there's a landing page) or just navigate to /register?ref=TUHNCH
  await page.goto('http://localhost:3000/register?ref=TUHNCH', { waitUntil: 'networkidle0' });

  // 3. Fill the form
  // Step 1
  await page.type('input[name="name"]', 'UI Path User');
  await page.type('input[name="phone"]', '9876543212');
  await page.click('button[type="submit"]'); // Next button
  
  // Step 2
  await page.waitForSelector('input[name="college_other"]', { visible: true });
  // Since college is a searchable dropdown, we might just type in college_other if it allows it.
  // Wait, in Phase 1, we made a searchable dropdown. Let's just click 'Other' in the combobox or type directly into branch
  
  // Wait, let's just use the API if Puppeteer is too flaky for complex UI.
  // Actually, I can evaluate JS in the context of the page to fill React state, but it's hard.
  // Let me look at the DOM structure of /register first, or just run it via API.
  
  // Let's just do a clean DOM fill
  await page.evaluate(() => {
    document.querySelector('input[name="college_other"]').value = 'Test College';
    document.querySelector('select[name="branch"]').value = 'CSE - Computer Science';
    document.querySelector('select[name="grad_year"]').value = '2025';
  });
  await page.click('button:nth-of-type(2)'); // Next button for Step 2
  
  // Step 3
  await page.waitForSelector('input[name="email"]', { visible: true });
  await page.type('input[name="email"]', 'uipath@example.com');
  await page.evaluate(() => {
    document.querySelector('select[name="slot"]').value = 'slot-1';
    document.querySelector('input[name="consent"]').click();
  });
  
  // Submit
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type="submit"]') // Submit button
  ]);
  
  console.log('Registration finished, URL:', page.url());
  
  await browser.close();
})();
