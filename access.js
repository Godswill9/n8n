const { google } = require('googleapis');
require('dotenv').config(); // Load env vars


// Auth setup
const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Convert escaped newlines back to real newlines
    ['https://www.googleapis.com/auth/drive']
  );
  
const drive = google.drive({ version: 'v3', auth: jwtClient });


// Route to make a file editable by anyone
const makeEditable = async (req, res) => {
  const { spreadsheetId } = req.body;

  if (!spreadsheetId) {
    return res.status(400).json({ error: 'spreadsheetId is required' });
  }

  try {
    await drive.permissions.create({
      resource: {
        type: 'anyone',
        role: 'writer',
      },
      fileId: spreadsheetId,
      fields: 'id',
    });
console.log('Permission granted to link:', spreadsheetId);
    res.json({ message: 'Permission granted to anyone with the link', spreadsheetId });
  } catch (error) {
    console.error('Error setting permissions:', error);
    res.status(500).json({ error: 'Failed to set permission', details: error.message });
  }
}   


  
module.exports = { makeEditable };