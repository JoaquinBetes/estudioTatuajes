import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./tatuador.controller.js";

export const tatuadorRouter = Router();

tatuadorRouter.get('/', findAll)
tatuadorRouter.get('/:dni', findOne)
tatuadorRouter.post('/', add)
tatuadorRouter.put('/:dni', update)
tatuadorRouter.delete('/:dni', remove)