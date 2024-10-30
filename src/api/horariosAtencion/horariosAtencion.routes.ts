import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./horariosAtencion.controller.js";

export const horariosAtencionRouter = Router();

horariosAtencionRouter.get('/', findAll)
horariosAtencionRouter.get('/:id', findOne)
horariosAtencionRouter.post('/', add)
horariosAtencionRouter.put('/:id', update)
horariosAtencionRouter.delete('/:id', remove)