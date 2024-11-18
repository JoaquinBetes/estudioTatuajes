import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Diseño } from '../diseño/diseño.entity.js'
import { Tatuador } from '../tatuador/tatuador.entity.js'
import { Cliente } from '../cliente/cliente.entity.js'
import { Turno } from './turno.entity.js'
import moment from 'moment';
import { clienteEstado } from '../shared/reglas.js'

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

      if(!clienteEstado(cliente.estado)){
        return res.status(500).json({ message: 'El cliente posee un estado de deudor, regularice su situación antes de continuar' });
      }


      const diseño = await em.findOne(Diseño, { id: req.body.diseño_id });
      if (!diseño) {
          return res.status(404).json({ message: 'diseño not found' });
      }
      diseño.estado = "res";
      // Validar y convertir horaInicio y horaFin usando moment.js
      const horaInicio = moment(req.body.hora_inicio, 'HH:mm:ss').format('HH:mm:ss');
      if ( horaInicio === 'Invalid date' ){
        return res.status(500).json({ message: 'Ingrese una hora válida' });
      }
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

async function findByTatuadorAndDate(req: Request, res: Response) {
  try {
    const tatuadorDni = req.params.tatuador_dni; // DNI o ID del tatuador
    // Buscar el tatuador por DNI
    const tatuador = await em.findOne(Tatuador, { dni: Number.parseInt(tatuadorDni) });
    if (!tatuador) {
      return res.status(404).json({ message: 'Tatuador no encontrado' });
    }
    // Consultar todos los turnos en la fecha especificada para el tatuador encontrado
    const turnos = await em.find(Turno, {
      tatuador: tatuador,
      fechaTurno: req.params.fecha_turno
    });
    res.status(200).json({ message: 'Turnos found successfully', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findByCliente(req: Request, res: Response) {
  try {
    const clienteDni = req.params.cliente_dni; // DNI del cliente
    // Buscar al cliente por DNI
    const cliente = await em.findOne(Cliente, { dni: Number.parseInt(clienteDni) });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    // Consultar todos los turnos asociados al cliente encontrado
    const turnos = await em.find(Turno, {
      cliente: cliente
    }, {
      populate: ['tatuador', 'diseño', 'cliente'] // Popula relaciones si es necesario
    });
    res.status(200).json({ message: 'Turnos found successfully', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function findByTatuador(req: Request, res: Response) {
  try {
    const tatuadorDni = req.params.tatuador_dni; // DNI del tatuador
    // Buscar al tatuador por DNI
    const tatuador = await em.findOne(Tatuador, { dni: Number.parseInt(tatuadorDni) });
    if (!tatuador) {
      return res.status(404).json({ message: 'Tatuador no encontrado' });
    }
    // Consultar todos los turnos asociados al tatuador encontrado
    const turnos = await em.find(Turno, {
      tatuador: tatuador
    }, {
      populate: ['cliente', 'diseño', 'tatuador'] // Popula relaciones si es necesario
    });
    res.status(200).json({ message: 'Turnos found successfully', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findTurnosByTatuadorForCurrentMonth(req: Request, res: Response) {
  try {
    const tatuadorDni = req.params.tatuador_dni; // Obtener DNI del tatuador desde los parámetros
    // Buscar al tatuador por DNI
    const tatuador = await em.findOne(Tatuador, { dni: Number.parseInt(tatuadorDni) });
    if (!tatuador) {
      return res.status(404).json({ message: 'Tatuador no encontrado' });
    }
    // Obtener el inicio y fin del mes actual usando moment.js
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    // Buscar turnos del tatuador en el rango de fechas (mes actual)
    const turnos = await em.find(
      Turno,
      {
        tatuador: tatuador,
        fechaTurno: {
          $gte: startOfMonth, // Fecha de turno mayor o igual al inicio del mes
          $lte: endOfMonth    // Fecha de turno menor o igual al final del mes
        }
      },
      {
        populate: ['cliente', 'diseño', 'tatuador'] // Popula relaciones si es necesario
      }
    );
    res.status(200).json({ message: 'Turnos found successfully for the current month', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllTurnosForCurrentMonth(req: Request, res: Response) {
  try {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    // Validación de fechas
    if (!startOfMonth.isValid() || !endOfMonth.isValid()) {
      return res.status(400).json({ message: 'Las fechas generadas no son válidas' });
    }
    // Buscar todos los turnos en el mes actual
    const turnos = await em.find(
      Turno,
      {
        fechaTurno: {
          $gte: startOfMonth.toDate(), // Fecha de turno mayor o igual al inicio del mes
          $lte: endOfMonth.toDate()    // Fecha de turno menor o igual al final del mes
        }
      },
      {
        populate: ['tatuador', 'diseño'] // Puedes incluir las relaciones necesarias
      }
    );
    res.status(200).json({ message: 'Turnos del mes actual encontrados exitosamente', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllTurnosForSpecificMonth(req: Request, res: Response) {
  try {
    // Obtener el mes desde los parámetros de la solicitud
    const { mes } = req.params;
    const mesNumerico = parseInt(mes, 10);
    // Validar que el mes sea un número válido
    if (isNaN(mesNumerico) || mesNumerico < 1 || mesNumerico > 12) {
      return res.status(400).json({ message: 'El mes proporcionado no es válido. Debe estar entre 1 y 12.' });
    }
    // Calcular el inicio y el fin del mes especificado en el año actual
    const startOfMonth = moment().month(mesNumerico - 1).startOf('month'); // Restamos 1 porque Moment utiliza índice 0 para los meses
    const endOfMonth = moment().month(mesNumerico - 1).endOf('month');
    // Validación de fechas
    if (!startOfMonth.isValid() || !endOfMonth.isValid()) {
      return res.status(400).json({ message: 'Las fechas generadas no son válidas.' });
    }
    // Buscar todos los turnos dentro del rango de fechas
    const turnos = await em.find(
      Turno,
      {
        fechaTurno: {
          $gte: startOfMonth.toDate(), // Fecha de turno mayor o igual al inicio del mes
          $lte: endOfMonth.toDate(),  // Fecha de turno menor o igual al final del mes
        },
      },
      {
        populate: ['tatuador', 'diseño'], // Puedes incluir las relaciones necesarias
      }
    );
    res.status(200).json({ message: 'Turnos del mes especificado encontrados exitosamente', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




async function findTurnosByTatuadorForLastThreeMonths(req: Request, res: Response) {
  try {
    const tatuadorDni = req.params.tatuador_dni; // Obtener DNI del tatuador desde los parámetros
    // Buscar al tatuador por DNI
    const tatuador = await em.findOne(Tatuador, { dni: Number.parseInt(tatuadorDni) });
    if (!tatuador) {
      return res.status(404).json({ message: 'Tatuador no encontrado' });
    }
    // Obtener el rango de fechas de los últimos 3 meses
    const threeMonthsAgo = moment().subtract(3, 'months').startOf('month').toDate();
    const today = moment().endOf('day').toDate();
    // Buscar turnos del tatuador en el rango de fechas (últimos 3 meses)
    const turnos = await em.find(
      Turno,
      {
        tatuador: tatuador,
        fechaTurno: {
          $gte: threeMonthsAgo, // Fecha de turno mayor o igual al inicio del rango
          $lte: today           // Fecha de turno menor o igual a hoy
        }
      },
      {
        populate: ['diseño'] // Popula relaciones si es necesario
      }
    );
    res.status(200).json({ message: 'Turnos found successfully for the last 3 months', data: turnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}





export { findAll, findOne, add, update, remove, findByTatuadorAndDate, findByCliente, findByTatuador,findTurnosByTatuadorForCurrentMonth, findTurnosByTatuadorForLastThreeMonths, findAllTurnosForCurrentMonth,findAllTurnosForSpecificMonth}