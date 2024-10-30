import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./liquidacion.controller.js";

export const liquidacionRouter = Router();

liquidacionRouter.get('/', findAll)
liquidacionRouter.get('/:id', findOne)
liquidacionRouter.post('/', add)
liquidacionRouter.put('/:id', update)
liquidacionRouter.delete('/:id', remove)