const express = require('express');
const axios = require('axios');
const app = express();

// Shopify App Credentials (from your custom app)
const clientId = '0f69440d80a20368a97c1a9908a7e0e0';
const clientSecret = '9579fda09212fe4f594ce524570be546';

// Step 1: Start OAuth (triggered by your mobile app)
app.get('/start-auth', (req, res) => {
  const shop = 'appricot-dev-store2.myshopify.com';
  const redirectUri = 'https://appricot-backend.onrender.com/auth/callback';
  const scopes = 'read_products,read_orders';

  const shopifyAuthUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

  console.log('🔗 Redirecting to Shopify:', shopifyAuthUrl);
  res.redirect(shopifyAuthUrl);
});

// Step 2: Shopify redirects here with ?code=...&shop=...
app.get('/auth/callback', async (req, res) => {
  const { code, shop } = req.query;

  console.log('📥 Received callback with:', { code, shop });

  if (!code || !shop) {
    console.warn('❌ Missing code or shop in callback');
    return res.status(400).send('Missing code or shop');
  }

  try {
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    });

    console.log('✅ Token response from Shopify:', tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;

    // Step 3: Redirect to mobile app with token
    const mobileRedirect = `appricot://redirect?shop=${shop}&token=${accessToken}`;
    console.log('🚀 Redirecting to app with token:', mobileRedirect);
    res.redirect(mobileRedirect);
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error('❌ Error during token exchange:', errData);
    res.status(500).send(`Authentication failed: ${JSON.stringify(errData)}`);
  }
});

// Optional: Fetch products using a saved access token (for testing)
app.get('/shopify/products', async (req, res) => {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
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

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});



