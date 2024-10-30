import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Liquidacion } from './liquidacion.entity.js'
import { Tatuador } from '../tatuador/tatuador.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const liquidaciones = await em.find(Liquidacion, {}, {
      populate: ['tatuador']
    })
    res.status(200).json({ message: 'Find all liquidaciones succesfully' , data: liquidaciones })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const liquidacion = await em.findOne(Liquidacion, {id}, {
      populate: ['tatuador']
    })
    if (liquidacion === null){
      res.status(404).json({ message: 'liquidacion was not found'})
    }
    res.status(200).json({ message: 'Find liquidacion succesfully' , data: liquidacion })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function add(req: Request, res: Response) {
  try {
      const tatuador = await em.findOne(Tatuador, { dni: req.body.tatuador_dni });
      if (!tatuador) {
        return res.status(404).json({ message: 'Tatuador not found' });
      }
      const liquidacion = em.create(Liquidacion, 
        {
        tatuador: tatuador, // Asigna el tatuador encontrado
        fechaInicioLiquidacion: req.body.fecha_inicio_liquidacion,
        fechaFinLiquidacion: req.body.fecha_fin_liquidacion,
        valorTotal: req.body.valor_total
      });
      await em.flush()
      res.status(201).json({ message: 'liquidacion added succesfully' , data: liquidacion })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const liquidacion = await em.findOne(Liquidacion, {id} )
    if (!liquidacion) {
      return res.status(404).json({ message: 'liquidacion not found' });
    }
    em.assign(liquidacion, req.body);
    await em.flush();
    res.status(200).json({message: 'liquidacions updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const liquidacion = em.getReference(Liquidacion, id)
    await em.removeAndFlush(liquidacion)
    res.status(200).json({message: 'liquidacions removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}