const express = require('express');
const axios = require('axios');
const app = express();

// Shopify App Credentials
const clientId = 'f0d4169b15e02a0e09519731ab6d6d20';
const clientSecret = 'b341216182d707e2c28c27de264e5c86';

// ✅ Health check route (proves backend is responding)
app.get('/', (req, res) => {
  res.send('✅ Appricot backend is running and ready.');
});

// Step 1: Start OAuth
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

  console.log('📥 Shopify callback received:', { code, shop });

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

    console.log('✅ Token exchange success:', tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;

    // Redirect to your mobile app with token
    const mobileRedirect = `appricot://redirect?shop=${shop}&token=${accessToken}`;
    console.log('🚀 Redirecting to mobile app:', mobileRedirect);
    res.redirect(mobileRedirect);
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error('❌ Token exchange error:', errData);
    res.status(500).send(`Authentication failed: ${JSON.stringify(errData)}`);
  }
});

// Optional: Product fetch test
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

// Start server on Render-compatible port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend is running on port ${PORT}`);
});




