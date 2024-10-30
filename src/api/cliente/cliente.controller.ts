import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Cliente } from './cliente.entity.js'

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
      const cliente = em.create(Cliente, req.body)
      await em.flush()
      res.status(201).json({ message: 'cliente added succesfully' , data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
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