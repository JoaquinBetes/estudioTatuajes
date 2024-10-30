import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./cliente.controller.js";

export const clienteRouter = Router();

clienteRouter.get('/', findAll)
clienteRouter.get('/:dni', findOne)
clienteRouter.post('/', add)
clienteRouter.put('/:dni', update)
clienteRouter.delete('/:dni', remove)