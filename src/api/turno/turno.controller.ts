import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Diseño } from '../diseño/diseño.entity.js'
import { Tatuador } from '../tatuador/tatuador.entity.js'
import { Cliente } from '../cliente/cliente.entity.js'
import { Turno } from './turno.entity.js'
import moment from 'moment';

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const turnos = await em.find(Turno, {}, {
      populate: ['tatuador', 'cliente', 'diseño']
    })
    res.status(200).json({ message: 'Find all turnos succesfully' , data: turnos })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const turno = await em.findOne(Turno, {id}, {
      populate: ['tatuador', 'cliente', 'diseño']
    });

    // Verificar si no se encontró el turno
    if (!turno) {
      return res.status(404).json({ message: 'Turno was not found' });
    }

    // Si se encuentra, responder con éxito
    res.status(200).json({ message: 'Turno found successfully', data: turno });
  } catch (error: any) {
    // Manejo de errores
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
      const tatuador = await em.findOne(Tatuador, { dni: req.body.tatuador_dni });
      if (!tatuador) {
          return res.status(404).json({ message: 'Tatuador not found' });
      }
      const cliente = await em.findOne(Cliente, { dni: req.body.cliente_dni });
      if (!cliente) {
          return res.status(404).json({ message: 'cliente not found' });
      }
      const diseño = await em.findOne(Diseño, { id: req.body.diseño_id });
      if (!diseño) {
          return res.status(404).json({ message: 'diseño not found' });
      }
      diseño.estado = "res";
      // Validar y convertir horaInicio y horaFin usando moment.js
      const horaInicio = moment(req.body.hora_inicio, 'HH:mm:ss').format('HH:mm:ss');
      const horaFin = moment(req.body.hora_fin, 'HH:mm:ss').format('HH:mm:ss');
      const fechaTurno = moment(req.body.fecha_turno).format('YYYY-MM-DD');


      // Crear el objeto turno con los valores correctos
      const turno = em.create(Turno, {
          horaInicio: horaInicio,
          horaFin: horaFin,
          fechaTurno: fechaTurno,
          tatuador: tatuador,
          cliente: cliente,
          diseño: diseño,
          indicaciones: req.body.indicaciones,
          estado: req.body.estado
      });

      // Guardar los datos en la base de datos
      await em.flush();
      res.status(201).json({ message: 'Turno added successfully', data: turno });
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    // Realizar la consulta con las claves compuestas
    const turno = await em.findOne(Turno, {id});

    if (!turno) {
      return res.status(404).json({ message: 'turno not found' });
    }
    const nuevoTurno = {
      fecha_turno: moment(req.body.fecha_turno).format('YYYY-MM-DD HH:mm:ss'),
      hora_inicio: moment(req.body.hora_inicio, 'HH:mm:ss').format('HH:mm:ss'),  // Formato de solo hora
      hora_fin: moment(req.body.hora_fin, 'HH:mm:ss').format('HH:mm:ss'),        // Formato de solo hora
      tatuador_dni: req.body.tatuador_dni,
      cliente_dni: req.body.cliente_dni,
      diseño_id: req.body.diseño_id,
      indicaciones: req.body.indicaciones,
      estado: req.body.estado
    } 
    em.assign(turno, req.body);
    await em.flush();
    res.status(200).json({message: 'turno updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {

    // Convertir los parámetros a objetos Date

    const id = Number.parseInt(req.params.id)
    // Buscar el turno en la base de datos
    const turno = await em.findOne(Turno, {id});
    // Si no se encuentra el turno, retornar un error 404
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    await em.removeAndFlush(turno)
    res.status(200).json({message: 'Turno eliminado exitosamente'})
    
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}