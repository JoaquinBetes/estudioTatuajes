import multer from "multer";
import path from "path";

// Configuración de Multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Obtener la extensión del archivo
    cb(null, Date.now() + fileExtension); // Nombre único basado en el timestamp
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño del archivo a 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    
    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos JPEG, JPG y PNG."));
    }
  }
});

export default upload;
