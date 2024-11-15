import { Router } from "express";
import { findAll, findOne, add, update, remove, findAllByIdTattoer, findAllAvailableDesigns, findAllByIdTattoerAndCategory } from "./diseño.controller.js";
import path from "path";
import Upload from "../../multer.config.js"; // Configuración de Multer

export const diseñoRouter = Router();

// Ruta para servir imágenes
diseñoRouter.get("/image/:id", (req, res) => {
  const { id } = req.params;
  const imagePath = path.join(__dirname, "uploads", `${id}.jpg`); // El nombre debe coincidir con el guardado en el backend

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send("Imagen no encontrada.");
    }
  });
});

// Ruta para cargar la imagen al agregar un diseño
diseñoRouter.post("/", Upload.single("imagen"), add); // Carga de imagen en POST

// Ruta para actualizar el diseño con posibilidad de actualizar la imagen
diseñoRouter.put("/:id", Upload.single("imagen"), update); // Usamos Upload.single('imagen') para procesar la imagen en el PUT

// Otras rutas
diseñoRouter.get("/", findAll);
diseñoRouter.get("/:id", findOne);
diseñoRouter.delete("/:id", remove);
diseñoRouter.get("/tatuador/:dni", findAllByIdTattoer);
diseñoRouter.get("/cliente/:estado", findAllAvailableDesigns);
diseñoRouter.get("/cliente/:dni/:codigo/:estado", findAllByIdTattoerAndCategory);

