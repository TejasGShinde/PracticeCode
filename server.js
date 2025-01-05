const express = require('express');
const cookieParser = require('cookie-parser');
const { ConfidentialClientApplication } = require('@azure/msal-node');

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback'; // Backend redirect URI
const FRONTEND_URI = 'http://localhost:4200/home'; // Frontend home page

// Initialize MSAL Confidential Client
const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
  },
});

const app = express();
app.use(cookieParser());

// Login route to redirect to Microsoft Authorization URL
app.get('/api/auth/login', async (req, res) => {
  const authCodeUrlParameters = {
    scopes: ['openid', 'profile', 'email'],
    redirectUri: REDIRECT_URI,
  };

  try {
    const authUrl = await msalClient.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl); // Redirect user to Microsoft Auth page
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).send('Error during login');
  }
});

// Callback route to handle redirect from Microsoft
app.get('/api/auth/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  const tokenRequest = {
    code: code,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: REDIRECT_URI,
  };

  try {
    // Acquire tokens using the authorization code
    const tokenResponse = await msalClient.acquireTokenByCode(tokenRequest);

    // Extract email and tokens
    const { accessToken, idToken, account } = tokenResponse;
    const email = account.username; // Email from token response

    // Set cookies or session tokens for secure storage
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('idToken', idToken, { httpOnly: true, secure: true });

    // Redirect back to frontend with email (optional)
    res.redirect(`${FRONTEND_URI}?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('Error acquiring token by code:', error);
    res.status(500).send('Authentication failed');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
