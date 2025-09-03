import axios, { AxiosError } from 'axios';

// Tipos para a API da HorsePay
type HorsePayAuthResponse = {
  access_token: string;
  expires_in: number;
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

type HorsePayErrorResponse = {
  error?: string;
  message?: string;
  status?: number;
  statusCode?: number;
};

class HorsePayService {
  private apiUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.apiUrl = process.env.HORSEPAY_API_URL || 'https://api.horsepay.io';
    // Corrigindo para usar HORSEPAY_CLIENT_KEY em vez de HORSEPAY_CLIENT_ID
    this.clientId = process.env.HORSEPAY_CLIENT_KEY || '';
    this.clientSecret = process.env.HORSEPAY_CLIENT_SECRET || '';
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('Credenciais da HorsePay não configuradas. O serviço de pagamento não funcionará corretamente.');
    }
  }

  /**
   * Autentica na API da HorsePay e obtém o token de acesso
   */
  private async authenticate(): Promise<void> {
    // Verificar se o token ainda é válido
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return;
    }

    try {
      const response = await axios.post<HorsePayAuthResponse>(
        `${this.apiUrl}/auth/token`,
        {
          client_key: this.clientId,
          client_secret: this.clientSecret
        }
      );

      this.accessToken = response.data.access_token;
      // Definir expiração com 5 minutos de antecedência para evitar token expirado
      // Corrigindo o cálculo do tempo de expiração
      this.tokenExpiry = Date.now() + (response.data.expires_in ? (response.data.expires_in - 300) * 1000 : 3600 * 1000);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<HorsePayErrorResponse>;
      
      console.error('Erro ao autenticar na HorsePay:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
      
      const errorMessage = axiosError.response?.data.message || 
                          axiosError.response?.data.error || 
                          axiosError.message;
                          
      throw new Error(`Falha na autenticação com a HorsePay: ${errorMessage}`);
    }
  }

  /**
   * Valida se o objeto é uma instância de AxiosError
   */
  private isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
  }

  /**
   * Trata e registra erros da API da HorsePay
   */
  private handleApiError(error: unknown, operation: string): never {
    if (this.isAxiosError(error)) {
      const errorResponse = error.response;
      const errorData = errorResponse?.data as HorsePayErrorResponse;
      
      const errorMessage = `
Operação: ${operation}
Status: ${errorResponse?.status || 'N/A'}
Mensagem: ${errorData.message || errorData.error || error.message}
Dados: ${JSON.stringify(errorData)}
      `.trim();
      
      console.error('Erro na API da HorsePay:', errorMessage);
      throw new Error(`Falha na operação com a HorsePay: ${operation}. Detalhes: ${errorData.message || error.message}`);
    } else {
      console.error('Erro inesperado:', error);
      throw new Error(`Erro inesperado durante operação com a HorsePay: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    try {
      await this.authenticate();
      
      const response = await axios.post<HorsePayCreateOrderResponse>(
        `${this.apiUrl}/transaction/neworder`,
        {
          payer_name: payerName,
          amount: amount,
          // Corrigindo uso das variáveis de ambiente para callback URLs
          callback_url: process.env.HORSEPAY_CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/pix/webhook`,
          split: split
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'createOrder');
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
    try {
      await this.authenticate();
      
      const response = await axios.post<HorsePayWithdrawResponse>(
        `${this.apiUrl}/transaction/withdraw`,
        {
          amount: amount,
          pix_key: pixKey,
          pix_type: pixType,
          // Corrigindo uso das variáveis de ambiente para callback URLs
          callback_url: process.env.WEBHOOK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/pix/webhook`
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'requestWithdraw');
      throw new Error('Falha ao solicitar saque');
    }
  }

  /**
   * Consulta o saldo do usuário
   */
  async getBalance(): Promise<HorsePayBalanceResponse> {
    try {
      await this.authenticate();
      
      const response = await axios.get<HorsePayBalanceResponse>(
        `${this.apiUrl}/user/balance`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'getBalance');
      throw new Error('Falha ao consultar saldo');
    }
  }

  /**
   * Consulta detalhes de um depósito específico
   */
  async getDepositDetails(id: number): Promise<HorsePayDepositResponse> {
    try {
      await this.authenticate();
      
      const response = await axios.get<HorsePayDepositResponse>(
        `${this.apiUrl}/api/orders/deposit/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'getDepositDetails');
      throw new Error('Falha ao consultar depósito');
    }
  }

  /**
   * Consulta detalhes de um saque específico
   */
  async getWithdrawDetails(id: number): Promise<HorsePayWithdrawDetailsResponse> {
    try {
      await this.authenticate();
      
      const response = await axios.get<HorsePayWithdrawDetailsResponse>(
        `${this.apiUrl}/api/orders/withdraw/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'getWithdrawDetails');
      throw new Error('Falha ao consultar saque');
    }
  }

  /**
   * Consulta o estado de um depósito bloqueado
   */
  async checkMed(id: number): Promise<HorsePayCheckMedResponse> {
    try {
      await this.authenticate();
      
      const response = await axios.get<HorsePayCheckMedResponse>(
        `${this.apiUrl}/api/orders/checkmed/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'checkMed');
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

  /**
   * Verifica se o objeto é uma instância válida de HorsePayCallbackDeposit
   */
  validateCallbackDeposit(data: any): data is HorsePayCallbackDeposit {
    return (
      typeof data === 'object' &&
      typeof data?.external_id === 'number' &&
      typeof data?.status === 'number' &&
      typeof data?.amount === 'number'
    );
  }

  /**
   * Verifica se o objeto é uma instância válida de HorsePayCallbackWithdraw
   */
  validateCallbackWithdraw(data: any): data is HorsePayCallbackWithdraw {
    return (
      typeof data === 'object' &&
      typeof data?.external_id === 'number' &&
      typeof data?.end_to_end_id === 'string' &&
      (typeof data?.status === 'number' || typeof data?.status === 'string') &&
      typeof data?.amount === 'number'
    );
  }
}

export default HorsePayService;