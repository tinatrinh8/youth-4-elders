/**
 * Google Apps Script for Youth 4 Elders Join Form
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Create a Google Sheet and note the Sheet ID from the URL
 * 5. Replace 'YOUR_SHEET_ID' with your actual Sheet ID
 * 6. Deploy as a web app with:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the web app URL and add it to your .env.local as NEXT_PUBLIC_GOOGLE_SCRIPT_URL
 */

function doPost(e) {
  try {
    // Get the Google Sheet
    const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your Google Sheet ID
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Phone',
        'Program',
        'Year',
        'Why Join',
        'How Heard'
      ]);
    }
    
    // Append the form data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.program || '',
      data.year || '',
      data.whyJoin || '',
      data.howHeard || ''
    ]);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Data saved successfully' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

