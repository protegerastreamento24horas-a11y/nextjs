import axios from 'axios';

// Tipos para a API da HorsePay
type HorsePayAuthResponse = {
  access_token: string;
};

type HorsePayCreateOrderRequest = {
  payer_name: string;
  amount: number;
  callback_url: string;
  split?: {
    user: string;
    percent: number;
  }[];
};

type HorsePayCreateOrderResponse = {
  copy_past: string;
  external_id: number;
  payer_name: string;
  payment: string; // Base64 da imagem QR Code
  status: number;
};

type HorsePayWithdrawRequest = {
  amount: number;
  pix_key: string;
  pix_type: string;
  callback_url: string;
};

type HorsePayWithdrawResponse = {
  message: string;
  external_id: number;
  end_to_end_id: string;
  amount: number;
  status: string;
};

type HorsePayCallbackDeposit = {
  external_id: number;
  status: number;
  amount: number;
};

type HorsePayCallbackWithdraw = {
  external_id: number;
  end_to_end_id: string;
  status: number | string;
  amount: number;
};

type HorsePayBalanceResponse = {
  balance: number;
};

type HorsePayDepositResponse = {
  id: number;
  value: number;
  tax: number;
  end_to_end: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type HorsePayWithdrawDetailsResponse = {
  id: number;
  value: number;
  tax: number;
  end_to_end: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type HorsePayCheckMedResponse = {
  external_id: string;
  status: 'pending' | 'rejected' | 'accepted';
  defense: boolean;
  defense_text: string;
};

class HorsePayService {
  private baseUrl = 'https://api.horsepay.io';
  private accessToken: string | null = null;
  private clientKey: string;
  private clientSecret: string;
  private callbackUrl: string;

  constructor() {
    this.clientKey = process.env.HORSEPAY_CLIENT_KEY || '';
    this.clientSecret = process.env.HORSEPAY_CLIENT_SECRET || '';
    this.callbackUrl = process.env.HORSEPAY_CALLBACK_URL || '';
    
    if (!this.clientKey || !this.clientSecret) {
      throw new Error('HORSEPAY_CLIENT_KEY e HORSEPAY_CLIENT_SECRET devem ser configurados nas variáveis de ambiente');
    }
  }

  /**
   * Autentica na API da HorsePay e obtém o token de acesso
   */
  async authenticate(): Promise<void> {
    try {
      const response = await axios.post<HorsePayAuthResponse>(
        `${this.baseUrl}/auth/token`,
        {
          client_key: this.clientKey,
          client_secret: this.clientSecret
        }
      );

      this.accessToken = response.data.access_token;
    } catch (error) {
      console.error('Erro ao autenticar na HorsePay:', error);
      throw new Error('Falha na autenticação com a HorsePay');
    }
  }

  /**
   * Cria um pedido de pagamento via PIX
   */
  async createOrder(
    payerName: string,
    amount: number,
    split?: { user: string; percent: number }[]
  ): Promise<HorsePayCreateOrderResponse> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.post<HorsePayCreateOrderResponse>(
        `${this.baseUrl}/transaction/neworder`,
        {
          payer_name: payerName,
          amount: amount,
          callback_url: this.callbackUrl,
          split: split
        } as HorsePayCreateOrderRequest,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido na HorsePay:', error);
      throw new Error('Falha ao criar pedido de pagamento');
    }
  }

  /**
   * Solicita um saque via PIX
   */
  async requestWithdraw(
    amount: number,
    pixKey: string,
    pixType: string
  ): Promise<HorsePayWithdrawResponse> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.post<HorsePayWithdrawResponse>(
        `${this.baseUrl}/transaction/withdraw`,
        {
          amount: amount,
          pix_key: pixKey,
          pix_type: pixType,
          callback_url: this.callbackUrl
        } as HorsePayWithdrawRequest,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao solicitar saque na HorsePay:', error);
      throw new Error('Falha ao solicitar saque');
    }
  }

  /**
   * Consulta o saldo do usuário
   */
  async getBalance(): Promise<HorsePayBalanceResponse> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.get<HorsePayBalanceResponse>(
        `${this.baseUrl}/user/balance`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar saldo na HorsePay:', error);
      throw new Error('Falha ao consultar saldo');
    }
  }

  /**
   * Consulta detalhes de um depósito específico
   */
  async getDepositDetails(id: number): Promise<HorsePayDepositResponse> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.get<HorsePayDepositResponse>(
        `${this.baseUrl}/api/orders/deposit/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar depósito na HorsePay:', error);
      throw new Error('Falha ao consultar depósito');
    }
  }

  /**
   * Consulta detalhes de um saque específico
   */
  async getWithdrawDetails(id: number): Promise<HorsePayWithdrawDetailsResponse> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.get<HorsePayWithdrawDetailsResponse>(
        `${this.baseUrl}/api/orders/withdraw/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar saque na HorsePay:', error);
      throw new Error('Falha ao consultar saque');
    }
  }

  /**
   * Consulta o estado de um depósito bloqueado
   */
  async checkMed(id: number): Promise<HorsePayCheckMedResponse> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.get<HorsePayCheckMedResponse>(
        `${this.baseUrl}/api/orders/checkmed/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar estado do depósito bloqueado na HorsePay:', error);
      throw new Error('Falha ao consultar estado do depósito bloqueado');
    }
  }

  /**
   * Processa o callback de pagamento
   */
  processPaymentCallback(data: HorsePayCallbackDeposit): void {
    // Aqui você pode implementar a lógica para processar o callback de pagamento
    console.log('Callback de pagamento recebido:', data);
    
    // Exemplo de tratamento:
    // Se status === 1, o pagamento foi confirmado
    // Você pode atualizar o status do bilhete no banco de dados
    // e realizar o sorteio para o usuário
  }

  /**
   * Processa o callback de saque
   */
  processWithdrawCallback(data: HorsePayCallbackWithdraw): void {
    // Aqui você pode implementar a lógica para processar o callback de saque
    console.log('Callback de saque recebido:', data);
    
    // Exemplo de tratamento:
    // Se status === 1, o saque foi confirmado
    // Se status === 0 ou "refunded", o saque falhou
  }
}

export default HorsePayService;