import HorsePayService from './horsepayService';

async function testHorsePay() {
  try {
    console.log('Testando autenticação com a API HorsePay...');
    
    const horsepay = new HorsePayService();
    
    // Testar obtenção de saldo
    const balance = await horsepay.getBalance();
    console.log('✅ Autenticação bem-sucedida!');
    console.log(`Saldo disponível: R$ ${(balance.balance/100).toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Erro ao testar autenticação com a HorsePay:', error);
  }
}

testHorsePay();