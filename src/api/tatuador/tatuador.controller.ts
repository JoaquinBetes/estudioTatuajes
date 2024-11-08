import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { controlDni, controlEmail, controlPK, controlTelyPass,isValidEmailFormat, controlRedes } from '../shared/reglas.js'
import { Turno } from '../turno/turno.entity.js'
import { Tatuador } from './tatuador.entity.js'
import { Liquidacion } from '../liquidacion/liquidacion.entity.js'
import { Diseño } from '../diseño/diseño.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const tatuadores = await em.find(Tatuador, {})
    res.status(200).json({ message: 'Find all tatuadores succesfully' , data: tatuadores })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const dni = Number.parseInt(req.params.dni)
    const tatuador = await em.findOne(Tatuador, {dni})
    if (tatuador === null){
      res.status(404).json({ message: 'tatuador was not found'})
    }
    res.status(200).json({ message: 'Find tatuador succesfully' , data: tatuador })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function add(req: Request, res: Response) {
  try {
    const dniValida = await controlDni(Tatuador, req.body.dni.toString())
    if (!dniValida) {
      return res.status(409).json({ message: 'El DNI ingresado no es valido' });
    }
    // Verifica si el Tatuador existe por DNI
    const dniDisponible = await controlPK(Tatuador, req.body.dni);
    if (!dniDisponible) {
      return res.status(409).json({ message: 'El Tatuador ya está registrado con este DNI' });
    }
    // verifica que sea valido el email
    const emailValido = isValidEmailFormat(req.body.email);
    if (!emailValido) {
      return res.status(409).json({ message: 'El email Ingresado no es valido' });
    }
    // Verifica si el email ya está registrado
    const emailDisponible = await controlEmail(Tatuador, req.body.email);
    if (!emailDisponible) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    const telefonoValido = await controlTelyPass(Tatuador, req.body.telefono.toString())
    if (!telefonoValido) {
      return res.status(409).json({ message: 'El telefono ingresado no es valido' });
    }
    const contraseñaValida = await controlTelyPass(Tatuador, req.body.contraseña)
    if (!contraseñaValida) {
      return res.status(409).json({ message: 'La contraseña ingresada no es valida' });
    }
  // Si ambos están disponibles, crea el Tatuador
    const tatuador = em.create(Tatuador, req.body)
    await em.flush()
    res.status(201).json({ message: 'tatuador added succesfully' , data: tatuador })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function update(req: Request, res: Response) {
  try {
    const dniActual = Number(req.params.dni);
    const tatuador = await em.findOne(Tatuador, { dni: dniActual });
    if (!tatuador) {
      return res.status(404).json({ message: 'Tatuador no encontrado' });
    }
    // verifica que sea valido el email
    const emailValido = isValidEmailFormat(req.body.email);
    if (!emailValido) {
      return res.status(409).json({ message: 'El email Ingresado no es valido' });
    }
    const telefonoValido = await controlTelyPass(Tatuador, req.body.telefono.toString())
    if (!telefonoValido) {
      return res.status(409).json({ message: 'El telefono ingresado no es valido' });
    }
    const contraseñaValida = await controlTelyPass(Tatuador, req.body.contraseña)
    if (!contraseñaValida) {
      return res.status(409).json({ message: 'La contraseña ingresada no es valida' });
    }
    // Extraer los datos del cuerpo de la petición
    const { dni: nuevoDni, email, telefono, contraseña, redesSociales } = req.body;
    // Actualizar el DNI solo si se proporciona un nuevo DNI
    if (nuevoDni) {
      if (!(await controlDni(Tatuador, nuevoDni.toString()))) {
        return res.status(409).json({ message: 'El nuevo DNI ingresado no es válido' });
      }
      if (nuevoDni !== dniActual && !(await controlPK(Tatuador, nuevoDni))) {
        return res.status(409).json({ message: 'El nuevo DNI ya está registrado en otro tatuador' });
      }
      // Actualiza el DNI en el tatuador
      tatuador.dni = nuevoDni;
      // Actualiza las entidades relacionadas
      await em.nativeUpdate(Liquidacion, { tatuador: { dni: dniActual } }, nuevoDni );
      await em.nativeUpdate(Diseño, { tatuador: { dni: dniActual } },  nuevoDni  );
      await em.nativeUpdate(Turno, { tatuador: { dni: dniActual } }, nuevoDni );
    }
    // Asigna otros campos que pueden haber cambiado
    em.assign(tatuador, req.body);
    // Guarda los cambios
    await em.flush();
    res.status(200).json({ message: 'Datos actualizados correctamente', data: tatuador });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function remove(req: Request, res: Response) {
  try {
    const dni = Number.parseInt(req.params.dni)
    const tatuador = await em.findOne(Tatuador, {dni}, {populate:['liquidaciones','turnos', 'diseños']})
    // Verificar si la categoría existe
    if (!tatuador) {
      return res.status(404).json({ message: 'tatuador not found' });
    }
    await em.removeAndFlush(tatuador)
    res.status(200).json({message: 'tatuador removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}