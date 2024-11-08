import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./diseño.controller.js";
import path from "path";
import Upload from "../../multer.config.js"; // Multer config

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

// Ruta para cargar la imagen
diseñoRouter.post("/", Upload.single("imagen"), add);  // Aquí está la ruta para la carga

// Otras rutas
diseñoRouter.get("/", findAll);
diseñoRouter.get("/:id", findOne);
diseñoRouter.put("/:id", update);
diseñoRouter.delete("/:id", remove);
