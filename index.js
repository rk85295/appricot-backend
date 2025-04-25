const express = require('express');
const app = express();

// Step 1: Send users to Shopify OAuth from backend
app.get('/start-auth', (req, res) => {
  const clientId = '57c7a1d0f2259185a267e20083963476';
  const redirectUri = 'https://appricot-backend.onrender.com/auth/callback';
  const scopes = 'read_products,read_orders';

  const loginUrl = `https://accounts.shopify.com/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code`;

  res.redirect(loginUrl);
});


// Step 2: Shopify redirects here after login
app.get('/auth/callback', (req, res) => {
  const { code, shop } = req.query;

  // This deep link sends the auth code back to your mobile app
  const mobileRedirect = `appricot://auth?code=${code}&shop=${shop}`;
  res.redirect(mobileRedirect);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});


