import { enviarCorreo } from '../shared/email.service.js'
import {Request, Response, NextFunction} from 'express'
async function enviarNotificacion(req: Request, res: Response) {
  try {
    const { email, asunto, mensaje } = req.body;

    if (!email || !asunto || !mensaje) {
      return res.status(400).json({ message: 'Faltan datos requeridos: email, asunto o mensaje.' });
    }
    // Enviar el correo
    await enviarCorreo(email, asunto, mensaje);
    res.status(200).json({ message: 'Correo enviado exitosamente.' });
  } catch (error: any) {
    res.status(500).json({ message: `Error al enviar correo: ${error.message}` });
  }
}

export { enviarNotificacion };
