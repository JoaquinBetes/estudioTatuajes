import { Router } from 'express';
import { enviarNotificacion } from './email.controller.js';

export const emailRouter = Router();

emailRouter.post('/enviar-correo', enviarNotificacion);


