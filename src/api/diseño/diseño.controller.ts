import {Request, Response, NextFunction} from 'express'
import { orm } from '../shared/db/orm.js'
import { Diseño } from './diseño.entity.js'
import { Tatuador } from '../tatuador/tatuador.entity.js'
import { Categoria } from '../categoria/categoria.entity.js'
import { controlEstado } from '../shared/reglas.js'
import { runInNewContext } from 'vm'


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

async function findAllByIdTattoer(req: Request, res: Response) {
  try {
    console.log(req.body)
    const diseños = await em.find(Diseño, { tatuador: {'dni': req.params }}, {
      populate: ['tatuador', 'categoria']
    })
    res.status(200).json({ message: 'Find all diseños succesfully' , data: diseños })
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  }
}

async function findAllByIdTattoerAndCategory(req: Request, res: Response) {
  try {
    // Obtener los parámetros de la URL
    const { dni, codigo } = req.params;
    // Convertir 'dni' a número
    const dniNumber = parseInt(dni, 10);
    const codigoNumber = parseInt(codigo, 10);

    if (isNaN(dniNumber) || isNaN(codigoNumber)) {
      return res.status(400).json({ message: "DNI o codigo no son válidos" });
    }

    // Realizar la búsqueda de los diseños filtrados por tatuador y categoría
    const diseños = await em.find(Diseño, 
      {
        // Filtra por tatuador y categoría usando el dni y el id convertidos a números
        tatuador: { dni: dniNumber },  // Convertido a número
        categoria: { codigo: codigoNumber },    // Convertido a número
        estado: req.params.estado
      },
      {
        populate: ['tatuador', 'categoria']
      }
    );
    // Responder con los datos encontrados
    res.status(200).json({
      message: 'Find all diseños successfully',
      data: diseños
    });
  } catch (error: any) {
    // Manejo de errores
    res.status(500).json({
      message: error.message
    });
  }
}


async function findAllAvailableDesigns(req: Request, res: Response) {
  try {
    const diseños = await em.find(Diseño, { estado: req.params.estado }, {
      populate: ['tatuador', 'categoria']
    });
    res.status(200).json({ message: 'Find all available diseños successfully', data: diseños });
  } catch (error: any) {
    res.status(500).json({ asd: "error.message" });
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const diseño = await em.findOne(Diseño, {id}, {
      populate: ['tatuador', 'categoria', 'turno']
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
      const tatuador = await em.findOne(Tatuador, { dni: req.body.tatuador_dni });
      if (!tatuador) {
          return res.status(404).json({ message: 'Tatuador not found' });
      }

      const categoria = await em.findOne(Categoria, { codigo: req.body.categoria_codigo });
      if (!categoria) {
          return res.status(404).json({ message: 'Categoria no encontrada' });
      }

      if(!controlEstado(req.body.estado)){
        return res.status(400).json({ message: "El Estado ingresado no es válido"})
      }

      if (req.body.tamanio_aproximado == 0) {
        return res.status(400).json({ message: 'El tamaño aproximado es obligatorio' });
      }
      if (req.body.colores.length == 0) {
        return res.status(400).json({ message: 'Ingresar colores' });
      }

      // Verificar si req.file existe antes de acceder a filename
      if (!req.file) {
          return res.status(400).json({ message: 'Ingrese una imagen' });
      }
      // Verificar que el archivo sea de tipo JPG o PNG
      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
          return res.status(400).json({ message: 'El archivo debe ser una imagen en formato JPG o PNG' });
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
      res.status(201).json({ message: 'Diseño agregado exitosamente', data: diseño });
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}


async function update(req: Request, res: Response) {
  const em = orm.em.fork(); // Crear una nueva instancia de EntityManager para este contexto
  try {
    const id = Number.parseInt(req.params.id);
    const diseño = await em.findOne(Diseño, { id });
    
    if (!diseño) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    // Validar el estado
    if (!controlEstado(req.body.estado)) {
      return res.status(500).json({ message: "El Estado ingresado no es válido" });
    }

    // Asignar los campos que llegaron en el body al diseño
    em.assign(diseño, req.body); // Esto asigna todos los campos que vienen en el body

    // Si se ha enviado una nueva imagen, se actualiza
    if (req.file) {
      // Si existe un archivo, se actualiza la imagen
      const imagenPath = `/uploads/${req.file.filename}`;
      diseño.imagen = imagenPath; // Actualiza la imagen en la entidad
    }

    // Actualizar el precio final si se ha pasado
    if (req.body.precio_final) {
      diseño.precioFinal = parseFloat(req.body.precio_final);
    }

    // Realizar la persistencia
    await em.flush();

    res.status(200).json({ message: 'Diseño actualizado exitosamente' });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const diseño = await em.findOne(Diseño, {id}, {populate:['turno']})
    // Verificar si la categoría existe
    if (!diseño) {
      return res.status(404).json({ message: 'diseño not found' });
    }
    await em.removeAndFlush(diseño)
    res.status(200).json({message: 'Diseño borrado exitosamente'})
  } catch (error: any) {
    res.status(500).json({ message: error.message})
  } 
};



export { findAll, findOne, add, update, remove, findAllByIdTattoer, findAllAvailableDesigns, findAllByIdTattoerAndCategory}