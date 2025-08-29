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
const simulateEmailSending = async (mailOptions: any): Promise<EmailResult> => {
  console.log('E-mail (simulado):', mailOptions);
  // Simular um pequeno atraso para parecer com um envio real
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, messageId: 'simulated-email-id' };
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
      
      // Evitar problemas de tipagem usando then/catch
      return await new Promise<EmailResult>((resolve) => {
        nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }).sendMail(mailOptions)
          .then((info: any) => {
            console.log('E-mail enviado:', info.messageId);
            resolve({ success: true, messageId: info.messageId });
          })
          .catch((sendError: any) => {
            console.error('Erro ao enviar e-mail:', sendError);
            resolve({ success: false, error: sendError.message || 'Erro ao enviar e-mail' });
          });
      });
    } else {
      // Em desenvolvimento, apenas simular o envio
      return await simulateEmailSending(mailOptions);
    }
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
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
      
      // Evitar problemas de tipagem usando then/catch
      return await new Promise<EmailResult>((resolve) => {
        nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }).sendMail(mailOptions)
          .then((info: any) => {
            console.log('Notificação enviada:', info.messageId);
            resolve({ success: true, messageId: info.messageId });
          })
          .catch((sendError: any) => {
            console.error('Erro ao enviar notificação:', sendError);
            resolve({ success: false, error: sendError.message || 'Erro ao enviar notificação' });
          });
      });
    } else {
      // Em desenvolvimento, apenas simular o envio
      return await simulateEmailSending(mailOptions);
    }
  } catch (error: any) {
    console.error('Erro ao enviar notificação:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
};