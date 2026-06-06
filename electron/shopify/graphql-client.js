function normalizeShopDomain(shopDomain) {
  if (!shopDomain) throw new Error('Shop domain mancante.');
  return shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

const tokenCache = new Map();

const EXPIRY_SAFETY_MS = 60 * 1000;

function clearTokenCache() {
  tokenCache.clear();
}

class ShopifyGraphqlClient {
  constructor({ shopDomain, clientId, clientSecret, apiVersion = '2026-04' }) {
    this.shopDomain = normalizeShopDomain(shopDomain);
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.apiVersion = apiVersion;
  }

  get cacheKey() {
    return `${this.shopDomain}:${this.clientId}`;
  }

  async requestToken() {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Client ID e Client secret Shopify mancanti.');
    }

    const response = await fetch(`https://${this.shopDomain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.access_token) {
      const detail = payload.error_description || payload.error || JSON.stringify(payload);
      throw new Error(`Autenticazione Shopify fallita (client credentials): ${detail}`);
    }

    const expiresInMs = (Number(payload.expires_in) || 86400) * 1000;
    tokenCache.set(this.cacheKey, {
      token: payload.access_token,
      scope: payload.scope || '',
      expiresAt: Date.now() + expiresInMs,
    });

    return payload;
  }

  async getAccessToken() {
    const cached = tokenCache.get(this.cacheKey);
    if (cached && cached.expiresAt - EXPIRY_SAFETY_MS > Date.now()) {
      return cached.token;
    }
    const payload = await this.requestToken();
    return payload.access_token;
  }

  async request(query, variables = {}) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://${this.shopDomain}/admin/api/${this.apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({ query, variables }),
      },
    );

    const payload = await response.json();
    if (!response.ok || payload.errors) {
      throw new Error(JSON.stringify(payload.errors || payload, null, 2));
    }

    return payload.data;
  }

  async testConnection() {
    tokenCache.delete(this.cacheKey);
    const tokenPayload = await this.requestToken();
    const data = await this.request('{ shop { name myshopifyDomain } }');
    return {
      ok: true,
      shopName: data.shop.name,
      shopDomain: data.shop.myshopifyDomain,
      scopes: (tokenPayload.scope || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }
}

module.exports = { ShopifyGraphqlClient, clearTokenCache };
