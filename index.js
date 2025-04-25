const express = require('express');
const app = express();

// Step 1: Send users to Shopify OAuth from backend
app.get('/start-auth', (req, res) => {
  const shop = 'appricot-dev-store2.myshopify.com';
  const clientId = '57c7a1d0f2259185a267e20083963476';
  const redirectUri = 'https://appricot-backend.onrender.com/auth/callback';
  const scopes = 'read_products,read_orders';

  const shopifyAuthUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

  res.redirect(shopifyAuthUrl);
});




// Step 2: Shopify redirects here after login
app.get('/auth/callback', (req, res) => {
  const { code, shop } = req.query;

  console.log('✅ CODE:', code);
  console.log('✅ SHOP:', shop);

  // TEMP: Show it in the browser for debugging
  res.send(`<h1>Success!</h1><p>Code: ${code}</p><p>Shop: ${shop}</p>`);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});


