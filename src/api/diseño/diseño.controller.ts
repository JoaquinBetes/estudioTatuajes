import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Diseño } from './diseño.entity.js'
import { Tatuador } from '../tatuador/tatuador.entity.js'
import { Categoria } from '../categoria/categoria.entity.js'


const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const diseños = await em.find(Diseño, {}, {
      populate: ['tatuador', 'categoria']
    })
    res.status(200).json({ message: 'Find all diseños succesfully' , data: diseños })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const diseño = await em.findOne(Diseño, {id}, {
      populate: ['tatuador', 'categoria']
    })
    if (diseño === null){
      res.status(404).json({ message: 'diseño was not found'})
    }
    res.status(200).json({ message: 'Find diseño succesfully' , data: diseño })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function add(req: Request, res: Response) {
  const em = orm.em.fork();
  try {
        console.log(req.body)
      const tatuador = await em.findOne(Tatuador, { dni: req.body.tatuador_dni });
      if (!tatuador) {
          return res.status(404).json({ message: 'Tatuador not found' });
      }

      const categoria = await em.findOne(Categoria, { codigo: req.body.categoria_codigo });
      if (!categoria) {
          return res.status(404).json({ message: 'Categoria not found' });
      }

      // Verificar si req.file existe antes de acceder a filename
      if (!req.file) {
          return res.status(400).json({ message: 'Image file is required' });
      }

      // Obtener la ruta de la imagen
      const imagenPath = `/uploads/${req.file.filename}`;

      const diseño = em.create(Diseño, {
          categoria,
          tatuador,
          tamanioAproximado: req.body.tamanio_aproximado,
          imagen: imagenPath, // Guardar solo la ruta
          precioBase: req.body.precio_base,
          descuento: req.body.descuento,
          precioFinal: req.body.precio_final,
          colores: req.body.colores,
          estado: req.body.estado
      });

      await em.flush();
      res.status(201).json({ message: 'Diseño added successfully', data: diseño });
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}


async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const diseño = await em.findOne(Diseño, {id} )
    if (!diseño) {
      return res.status(404).json({ message: 'diseño not found' });
    }
    em.assign(diseño, req.body);
    await em.flush();
    res.status(200).json({message: 'diseños updated succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
};

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const diseño = await em.findOne(Diseño, {id}, {populate:['turno']})
    // Verificar si la categoría existe
    if (!diseño) {
      return res.status(404).json({ message: 'diseño not found' });
    }
    await em.removeAndFlush(diseño)
    res.status(200).json({message: 'diseño removed succesfully'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};



export { findAll, findOne, add, update, remove}