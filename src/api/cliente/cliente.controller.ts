import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Cliente } from './cliente.entity.js'
import { controlPK, controlEmail, controlTelyPass, controlDni, isValidEmailFormat } from '../shared/reglas.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const clientes = await em.find(Cliente, {})
    res.status(200).json({ message: 'Find all clientes succesfully' , data: clientes })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const dni = Number.parseInt(req.params.dni)
    const cliente = await em.findOne(Cliente, {dni})
    if (cliente === null){
      res.status(404).json({ message: 'cliente was not found'})
    }
    res.status(200).json({ message: 'Find cliente succesfully' , data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function add(req: Request, res: Response) {
  try {
    const dniValida = await controlDni(Cliente, req.body.dni.toString())
    if (!dniValida) {
      return res.status(409).json({ message: 'El DNI ingresado no es valido' });
    }
    // Verifica si el cliente existe por DNI
    const dniDisponible = await controlPK(Cliente, req.body.dni);
    if (!dniDisponible) {
      return res.status(409).json({ message: 'El cliente ya está registrado con este DNI' });
    }
    // verifica que sea valido el email
    const emailValido = isValidEmailFormat(req.body.email);
    if (!emailValido) {
      return res.status(409).json({ message: 'El email Ingresado no es valido' });
    }
    // Verifica si el email ya está registrado
    const emailDisponible = await controlEmail(Cliente, req.body.email);
    if (!emailDisponible) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    const telefonoValido = await controlTelyPass(Cliente, req.body.telefono.toString())
    if (!telefonoValido) {
      return res.status(409).json({ message: 'El telefono ingresado no es valido' });
    }
    const contraseñaValida = await controlTelyPass(Cliente, req.body.contraseña)
    if (!contraseñaValida) {
      return res.status(409).json({ message: 'La contraseña ingresada no es valida' });
    }
    // Si ambos están disponibles, crea el cliente
    const cliente = em.create(Cliente, req.body);
    await em.flush();
    res.status(201).json({ message: 'El cliente fue registrado exitosamente', data: cliente });
    
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const dni = Number.parseInt(req.params.dni)
    const cliente = await em.findOne(Cliente, {dni} )
    if (!cliente) {
      return res.status(404).json({ message: 'cliente not found' });
    }
    em.assign(cliente, req.body);
    await em.flush();
    res.status(200).json({message: 'clientes updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {
    const dni = Number.parseInt(req.params.dni)
    const cliente = await em.findOne(Cliente, {dni}, {populate:['turnos']})
    // Verificar si la categoría existe
    if (!cliente) {
      return res.status(404).json({ message: 'cliente not found' });
    }
    await em.removeAndFlush(cliente)
    res.status(200).json({message: 'cliente removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}