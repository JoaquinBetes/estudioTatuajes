import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Categoria } from './categoria.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const categorias = await em.find(Categoria, {})
    res.status(200).json({ message: 'Find all categorias succesfully' , data: categorias })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const codigo = Number.parseInt(req.params.codigo)
    const categoria = await em.findOne(Categoria, {codigo})
    if (categoria === undefined){
      res.status(404).json({ message: 'categoria was not found'})
    }
    res.status(200).json({ message: 'Find categoria succesfully' , data: categoria })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
  
}

async function add(req: Request, res: Response) {
  console.log(req.body)
  try {
      const categoria = em.create(Categoria, req.body)
      await em.flush()
      res.status(201).json({ message: 'categoria added succesfully' , data: categoria })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function update(req: Request, res: Response) {
  try {
    const codigo = Number.parseInt(req.params.codigo)
    const categoria = await em.findOne(Categoria, {codigo} )
    if (!categoria) {
      return res.status(404).json({ message: 'categoria not found' });
    }
    em.assign(categoria, req.body);
    await em.flush();
    res.status(200).json({message: 'categorias updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {
    const codigo = Number.parseInt(req.params.codigo)
    const categoria = await em.findOne(Categoria, {codigo}, {populate:['diseños']})
    // Verificar si la categoría existe
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria not found' });
    }
    await em.removeAndFlush(categoria)
    res.status(200).json({message: 'categoria removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}