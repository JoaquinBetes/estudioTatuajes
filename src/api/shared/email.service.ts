import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'estudiodetatuajes23@gmail.com',
    pass: 'ghojksiaossfzaoh'
  },
});
//ghoj ksia ossf zaoh
// Definimos los tipos de los parámetros y el retorno de la función
export async function enviarCorreo(destinatario: string, asunto: string, mensaje: string): Promise<void> {
  const mailOptions = {
    from: "estudiodetatuajes23@gmail.com",
    to: destinatario,
    subject: asunto,
    text: mensaje,
    html: `<p>${mensaje}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo.');
  }
}
