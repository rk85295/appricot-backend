import axios from 'axios';

const clientId = 'f0d4169b15e02a0e09519731ab6d6d20';
const clientSecret = 'b341216182d707e2c28c27de264e5c86';

export default async function handler(req, res) {
  const { code, shop, state } = req.query;

  if (!code || !shop || !state) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    const tokenRes = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    });

    const accessToken = tokenRes.data.access_token;
    const redirect = `${state}?shop=${shop}&token=${accessToken}`;

    console.log('✅ OAuth Success, redirecting to:', redirect);
    return res.redirect(redirect);
  } catch (err) {
    console.error('❌ Error exchanging code:', err.response?.data || err.message);
    return res.status(500).send('OAuth token exchange failed');
  }
}


