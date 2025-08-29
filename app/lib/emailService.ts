import nodemailer from 'nodemailer';

// Tipos para as funções de e-mail
type EmailData = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type WinnerData = {
  userName: string;
  userEmail: string;
  prizeName: string;
};

// Criar transporte de e-mail
// Em produção, você usaria um serviço real como SendGrid, AWS SES, etc.
const createTransporter = () => {
  // Para desenvolvimento, usamos o Ethereal Email (https://ethereal.email/)
  // Em produção, configure com suas credenciais reais
  
  // Verificar se estamos em produção
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Para desenvolvimento, retornar transporte falso
  return nodemailer.createTransport({
    // Em desenvolvimento, não enviamos e-mails reais
    // Você pode configurar o Ethereal Email para testes
    jsonTransport: true,
  });
};

// Enviar e-mail para vencedor
export const sendWinnerEmail = async (winnerData: WinnerData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions: EmailData = {
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
    
    // Em produção, realmente enviar o e-mail
    if (process.env.NODE_ENV === 'production') {
      const info = await transporter.sendMail(mailOptions);
      console.log('E-mail enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } else {
      // Em desenvolvimento, apenas logar o e-mail
      console.log('E-mail (simulado):', mailOptions);
      return { success: true, messageId: 'simulated-email-id' };
    }
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};

// Enviar notificação para administradores
export const sendAdminNotification = async (subject: string, message: string) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rifapremiada.com';
    
    const mailOptions: EmailData = {
      to: adminEmail,
      subject: `[Rifa Premiada] ${subject}`,
      text: message,
    };
    
    // Em produção, realmente enviar o e-mail
    if (process.env.NODE_ENV === 'production') {
      const info = await transporter.sendMail(mailOptions);
      console.log('Notificação enviada:', info.messageId);
      return { success: true, messageId: info.messageId };
    } else {
      // Em desenvolvimento, apenas logar
      console.log('Notificação (simulada):', mailOptions);
      return { success: true, messageId: 'simulated-notification-id' };
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};