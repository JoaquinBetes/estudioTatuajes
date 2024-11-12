import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Politicas } from './politicas.entity.js'
import { esNumero } from '../shared/reglas.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const politicas = await em.find(Politicas, {})
    res.status(200).json({ message: 'Find all politicas succesfully' , data: politicas })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const politicas = await em.findOne(Politicas, {id})
    if (politicas === undefined){
      res.status(404).json({ message: 'politicas was not found'})
    }
    res.status(200).json({ message: 'Find politicas succesfully' , data: politicas })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function add(req: Request, res: Response) {
  try {
      const politicas = em.create(Politicas, {
        precioBaseMinimo: req.body.precio_base_minimo,
        descuentoMaximo: req.body.descuento_maximo,
        comisionesEstudio: req.body.comisiones_estudio
      })
      await em.flush()
      res.status(201).json({ message: 'politicas added succesfully' , data: politicas })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const politica = await em.findOne(Politicas, {id} )
    if (!politica) {
      return res.status(404).json({ message: 'Politica not found' });
    }
    console.log(req.body)
    if (esNumero(req.body.precioBaseMinimo) && esNumero(req.body.descuentoMaximo) && esNumero(req.body.comisionesEstudio)){
      em.assign(politica, req.body);
      await em.flush();
      res.status(200).json({message: 'Políticas actualizadas'})
    }
    else{ res.status(500).json({ message: "Alguno de los valores ingresados no es un numero"}) }

  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const politicas = em.getReference(Politicas, id)
    await em.removeAndFlush(politicas)
    res.status(200).json({message: 'politicas removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}