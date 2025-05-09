const clientId = 'f0d4169b15e02a0e09519731ab6d6d20';

export default function handler(req, res) {
  const shop = 'appricot-dev-store2.myshopify.com';
  const scopes = 'read_products,read_orders';
  const redirectUri = 'https://appricot-backend-1w5ooov2i-renas-projects-6308d65e.vercel.app/api/auth-callback';
  const mobileRedirect = req.query.redirect;

  if (!mobileRedirect) {
    return res.status(400).send('Missing ?redirect parameter');
  }

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(mobileRedirect)}`;

  console.log('🔗 Redirecting to Shopify OAuth:', authUrl);
  return res.redirect(authUrl);
}

