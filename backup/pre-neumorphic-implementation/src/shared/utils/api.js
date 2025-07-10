// API utilities
window.api = {
  baseUrl: '',

  async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(this.baseUrl + url, config);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(url) {
    return this.request(url, { method: 'GET' });
  },

  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
