import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./turno.controller.js";

export const turnoRouter = Router();

turnoRouter.get('/', findAll)
turnoRouter.get('/:hora_inicio/:hora_fin/:fecha_turno', findOne)
turnoRouter.post('/', add)
turnoRouter.put('/:hora_inicio/:hora_fin/:fecha_turno', update)
turnoRouter.delete('/:hora_inicio/:hora_fin/:fecha_turno', remove)