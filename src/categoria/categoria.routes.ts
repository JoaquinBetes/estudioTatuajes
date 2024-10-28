import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./categoria.controller.js";

export const categoriaRouter = Router();

categoriaRouter.get('/', findAll)
categoriaRouter.get('/:codigo', findOne)
categoriaRouter.post('/', add)
categoriaRouter.put('/:codigo', update)
categoriaRouter.delete('/:codigo', remove)