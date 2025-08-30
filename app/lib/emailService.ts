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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">🎉 Parabéns, ${winnerData.userName}!</h2>
          <p>Você foi sorteado na nossa <strong>Rifa Premiada</strong> e ganhou:</p>
          <h3 style="color: #ec4899;">${winnerData.prizeName}</h3>
          <p>Entre em contato conosco respondendo a este e-mail para receber seu prêmio.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p><small>Atenciosamente,<br>Equipe Rifa Premiada</small></p>
        </div>
      `
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
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: `"Rifa Premiada" <${process.env.SMTP_USER}>`,
          to: mailOptions.to,
          subject: mailOptions.subject,
          text: mailOptions.text,
          html: mailOptions.html
        });

        return { success: true, messageId: info.messageId };
      } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return { success: false, error: 'Falha ao enviar e-mail' };
      }
    } else {
      // Em desenvolvimento, simular o envio
      return await simulateEmailSending(mailOptions);
    }
  } catch (error) {
    console.error('Erro inesperado ao enviar e-mail:', error);
    return { success: false, error: 'Erro inesperado ao enviar e-mail' };
  }
};