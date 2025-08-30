const axios = require('axios');

async function testHorsePay() {
  try {
    console.log('Testando autenticação com a API HorsePay...');
    
    const clientId = process.env.HORSEPAY_CLIENT_KEY;
    const clientSecret = process.env.HORSEPAY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.log('❌ Credenciais da HorsePay não encontradas. Verifique as variáveis de ambiente.');
      return;
    }
    
    const response = await axios.post('https://api.horsepay.io/auth/token', {
      client_key: clientId,
      client_secret: clientSecret
    });
    
    console.log('✅ Autenticação bem-sucedida!');
    console.log(`Token: ${response.data.access_token.substring(0, 20)}...`);
    console.log(`Expira em: ${response.data.expires_in} segundos`);
    
  } catch (error) {
    console.error('❌ Erro ao testar autenticação com a HorsePay:', error.response?.data || error.message);
  }
}

testHorsePay();