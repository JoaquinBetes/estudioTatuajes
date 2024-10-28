import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./politicas.controller.js";

export const politicasRouter = Router();

politicasRouter.get('/', findAll)
politicasRouter.get('/:id', findOne)
politicasRouter.post('/', add)
politicasRouter.put('/:id', update)
politicasRouter.delete('/:id', remove)