import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Sucursal } from './sucursal.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const sucursales = await em.find(Sucursal, {})
    res.status(200).json({ message: 'Find all sucursal succesfully' , data: sucursales })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const sucursal = await em.findOne(Sucursal, {id})
    if (sucursal === undefined){
      res.status(404).json({ message: 'sucursal was not found'})
    }
    res.status(200).json({ message: 'Find sucursal succesfully' , data: sucursal })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function add(req: Request, res: Response) {
  try {
      const sucursal = em.create(Sucursal,  req.body )
      await em.flush()
      res.status(201).json({ message: 'politicas added succesfully' , data: sucursal })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const sucursal = await em.findOne(Sucursal, {id} )
    if (!sucursal) {
      return res.status(404).json({ message: 'sucursal not found' });
    }
    em.assign(sucursal, req.body);
    await em.flush();
    res.status(200).json({message: 'sucursal updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const sucursal = await em.findOne(Sucursal, {id}, {populate:['horariosAtenciones']})
    // Verificar si la categoría existe
    if (!sucursal) {
      return res.status(404).json({ message: 'sucursal not found' });
    }
    await em.removeAndFlush(sucursal)
    res.status(200).json({message: 'sucursal removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}