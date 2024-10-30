import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Diseño } from '../diseño/diseño.entity.js'
import { Tatuador } from '../tatuador/tatuador.entity.js'
import { Cliente } from '../cliente/cliente.entity.js'
import { Turno } from './turno.entity.js'

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
    // Extraer los parámetros de la URL
    const { hora_inicio, hora_fin, fecha_turno } = req.params;

    // Convertir los parámetros a objetos Date
    const horaInicioDate = new Date(hora_inicio);
    const horaFinDate = new Date(hora_fin);
    const fechaTurnoDate = new Date(fecha_turno);

    // Realizar la consulta con las claves compuestas
    const turno = await em.findOne(Turno, {
      horaInicio: horaInicioDate,
      horaFin: horaFinDate,
      fechaTurno: fechaTurnoDate,
    }, {
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

        const turno = em.create(Turno, {
            horaInicio: req.body.hora_inicio,
            horaFin: req.body.hora_fin,
            fechaTurno: req.body.fecha_turno,
            tatuador: tatuador,
            cliente: cliente,
            diseño: diseño,
            estado: req.body.estado
        });
        await em.flush()
        res.status(201).json({ message: 'turno added succesfully' , data: turno })
    } catch (error: any) {
    res.status(500).json({ message: error.message})
    }
}

async function update(req: Request, res: Response) {
  try {
    // Extraer los parámetros de la URL
    const { hora_inicio, hora_fin, fecha_turno } = req.params;

    // Convertir los parámetros a objetos Date
    const horaInicioDate = new Date(hora_inicio);
    const horaFinDate = new Date(hora_fin);
    const fechaTurnoDate = new Date(fecha_turno);

    // Realizar la consulta con las claves compuestas
    const turno = await em.findOne(Turno, {
      horaInicio: horaInicioDate,
      horaFin: horaFinDate,
      fechaTurno: fechaTurnoDate,
    });

    if (!turno) {
      return res.status(404).json({ message: 'turno not found' });
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

    // Extraer los parámetros de la URL
    const { hora_inicio, hora_fin, fecha_turno } = req.params;
    // Convertir los parámetros a objetos Date
    const horaInicioDate = new Date(hora_inicio);
    const horaFinDate = new Date(hora_fin);
    const fechaTurnoDate = new Date(fecha_turno);

    // Buscar el turno en la base de datos
    const turno = await em.findOne(Turno, {
      horaInicio: horaInicioDate,
      horaFin: horaFinDate,
      fechaTurno: fechaTurnoDate,
    });
    // Si no se encuentra el turno, retornar un error 404
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    await em.removeAndFlush(turno)
    res.status(200).json({message: 'liquidacions removed succesfully'})
    
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}