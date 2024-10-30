import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./sucursal.controller.js";

export const sucursalRouter = Router();

sucursalRouter.get('/', findAll)
sucursalRouter.get('/:id', findOne)
sucursalRouter.post('/', add)
sucursalRouter.put('/:id', update)
sucursalRouter.delete('/:id', remove)