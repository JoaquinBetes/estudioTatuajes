import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Tatuador } from './tatuador.entity.js'

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
      const tatuador = em.create(Tatuador, req.body)
      await em.flush()
      res.status(201).json({ message: 'tatuador added succesfully' , data: tatuador })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function update(req: Request, res: Response) {
  try {
    const dni = Number.parseInt(req.params.dni)
    const tatuador = await em.findOne(Tatuador, {dni} )
    if (!tatuador) {
      return res.status(404).json({ message: 'tatuador not found' });
    }
    em.assign(tatuador, req.body);
    await em.flush();
    res.status(200).json({message: 'tatuador updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

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