// Serviço de envio de e-mails simplificado
// Esta é uma implementação básica que evita problemas de tipagem com nodemailer

interface WinnerData {
  userName: string;
  userEmail: string;
  prizeName: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Função para simular o envio de e-mail em desenvolvimento
const simulateEmailSending = async (mailOptions: any): Promise<any> => {
  console.log('E-mail (simulado):', mailOptions);
  // Simular um pequeno atraso para parecer com um envio real
  await new Promise(resolve => setTimeout(resolve, 100));
  return { messageId: 'simulated-email-id' };
};

// Criar transporte de e-mail
const createTransporter = () => {
  // Esta função não será usada diretamente para evitar problemas de tipagem
  return null;
};

// Enviar e-mail para vencedor
export const sendWinnerEmail = async (winnerData: WinnerData): Promise<EmailResult> => {
  try {
    const mailOptions = {
      to: winnerData.userEmail,
      subject: '🎉 Parabéns! Você ganhou na Rifa Premiada!',
      text: `Olá ${winnerData.userName},

Parabéns! Você foi sorteado na nossa rifa e ganhou: ${winnerData.prizeName}.

Entre em contato conosco respondendo a este e-mail para receber seu prêmio.

Atenciosamente,
Equipe Rifa Premiada`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">🎉 Parabéns, ${winnerData.userName}!</h2>
          
          <p>Você foi sorteado na nossa rifa e ganhou:</p>
          
          <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin: 0; font-size: 24px;">${winnerData.prizeName}</h3>
          </div>
          
          <p>Entre em contato conosco respondendo a este e-mail para receber seu prêmio.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #666;">
            Atenciosamente,<br>
            <strong>Equipe Rifa Premiada</strong>
          </p>
        </div>
      `,
    };

    // Em produção, verificar se as variáveis de ambiente estão definidas
    if (process.env.NODE_ENV === 'production') {
      // Verificar se as variáveis de ambiente necessárias estão definidas
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('Configurações de SMTP incompletas. E-mail não enviado.');
        return { success: false, error: 'Configurações de SMTP incompletas' };
      }

      // Em produção, usar nodemailer para enviar o e-mail
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Enviar o e-mail e tratar o resultado de forma segura
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info.messageId);
        return { success: true, messageId: info.messageId as string };
      } catch (sendError) {
        console.error('Erro ao enviar e-mail:', sendError);
        return { success: false, error: sendError instanceof Error ? sendError.message : 'Erro ao enviar e-mail' };
      }
    } else {
      // Em desenvolvimento, apenas simular o envio
      const result = await simulateEmailSending(mailOptions);
      return { success: true, messageId: result.messageId };
    }
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};

// Enviar notificação para administradores
export const sendAdminNotification = async (subject: string, message: string): Promise<EmailResult> => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rifapremiada.com';
    
    const mailOptions = {
      to: adminEmail,
      subject: `[Rifa Premiada] ${subject}`,
      text: message,
    };

    // Em produção, verificar se as variáveis de ambiente estão definidas
    if (process.env.NODE_ENV === 'production') {
      // Verificar se as variáveis de ambiente necessárias estão definidas
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('Configurações de SMTP incompletas. Notificação não enviada.');
        return { success: false, error: 'Configurações de SMTP incompletas' };
      }

      // Em produção, usar nodemailer para enviar o e-mail
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Enviar o e-mail e tratar o resultado de forma segura
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Notificação enviada:', info.messageId);
        return { success: true, messageId: info.messageId as string };
      } catch (sendError) {
        console.error('Erro ao enviar notificação:', sendError);
        return { success: false, error: sendError instanceof Error ? sendError.message : 'Erro ao enviar notificação' };
      }
    } else {
      // Em desenvolvimento, apenas simular o envio
      const result = await simulateEmailSending(mailOptions);
      return { success: true, messageId: result.messageId };
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};