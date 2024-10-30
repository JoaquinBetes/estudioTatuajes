import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { HorariosAtencion } from './horariosAtencion.entity.js'
import { Sucursal } from '../sucursal/sucursal.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const horariosAtenciones = await em.find(HorariosAtencion, {}, {
      populate:['sucursal']
    })
    res.status(200).json({ message: 'Find all horariosAtenciones succesfully' , data: horariosAtenciones })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const horariosAtencion = await em.findOne(HorariosAtencion, {id}, {
      populate:['sucursal']
    })
    if (horariosAtencion === undefined){
      res.status(404).json({ message: 'horariosAtencion was not found'})
    }
    res.status(200).json({ message: 'Find horariosAtencion succesfully' , data: horariosAtencion })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function add(req: Request, res: Response) {
  try {
      const sucursal = await em.findOne(Sucursal, { id: req.body.sucursal_id });
      if (!sucursal) {
        return res.status(404).json({ message: 'sucursal not found' });
      }
      const horariosAtencion = em.create(HorariosAtencion, 
        {
        sucursal: sucursal, // Asigna el tatuador encontrado
        horaApertura: req.body.hora_apertura,
        horaCierre: req.body.hora_cierre,
        diaSeamana: req.body.dia_seamana
      });
      await em.flush()
      res.status(201).json({ message: 'horariosAtencion added succesfully' , data: horariosAtencion })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const horariosAtencion = await em.findOne(HorariosAtencion, {id} )
    if (!horariosAtencion) {
      return res.status(404).json({ message: 'horariosAtencion not found' });
    }
    em.assign(horariosAtencion, req.body);
    await em.flush();
    res.status(200).json({message: 'horariosAtencions updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const horariosAtencion = em.getReference(HorariosAtencion, id)
    await em.removeAndFlush(horariosAtencion)
    res.status(200).json({message: 'horariosAtencion removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};


export { findAll, findOne, add, update, remove}