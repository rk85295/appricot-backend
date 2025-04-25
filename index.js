const express = require('express');
const axios = require('axios');
const app = express();

// Step 1: Start OAuth
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

// Step 3: Manually test token exchange (temporary route)
app.get('/auth/token', async (req, res) => {
  const code = '7a4dd8fd8c7e37dac706f919a6964fbe'; // update with new code if needed
  const shop = 'appricot-dev-store2.myshopify.com';
  const clientId = '57c7a1d0f2259185a267e20083963476';
  const clientSecret = '35df4943fec361832ced223ae1c63f75';

  try {
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    });

    console.log('✅ ACCESS TOKEN:', response.data.access_token);
    res.send(`<h1>Access Token:</h1><p>${response.data.access_token}</p>`);
  } catch (error) {
    console.error('❌ Token error:', error.response?.data || error.message);
    res.status(500).send('Token exchange failed');
  }
});

// ✅ Step 4: Get Shopify products using environment variable token
app.get('/shopify/products', async (req, res) => {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN; // no hardcoded token here
  const shop = 'appricot-dev-store2.myshopify.com';

  if (!accessToken) {
    return res.status(400).send('No access token found. Set SHOPIFY_ACCESS_TOKEN as an env variable.');
  }

  try {
    const response = await axios.get(`https://${shop}/admin/api/2023-10/products.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    });

    console.log('✅ PRODUCTS:', response.data.products);
    res.send(response.data.products);
  } catch (error) {
    console.error('❌ Failed to fetch products:', error.response?.data || error.message);
    res.status(500).send('Could not fetch products');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});


