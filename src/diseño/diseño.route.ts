import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./diseño.controller.js";

export const diseñoRouter = Router();

diseñoRouter.get('/', findAll)
diseñoRouter.get('/:id', findOne)
diseñoRouter.post('/', add)
diseñoRouter.put('/:id', update)
diseñoRouter.delete('/:id', remove)