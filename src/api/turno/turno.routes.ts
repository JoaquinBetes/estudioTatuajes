import { Router } from "express";
import {  findAll, findOne, add, update, remove,findByTatuadorAndDate, findByCliente, findByTatuador, findTurnosByTatuadorForCurrentMonth } from "./turno.controller.js";

export const turnoRouter = Router();

turnoRouter.get('/', findAll)
turnoRouter.get('/:id', findOne)
turnoRouter.post('/', add)
turnoRouter.put('/:id', update)
turnoRouter.delete('/:id', remove)
turnoRouter.get('/tatuador/:tatuador_dni/fecha/:fecha_turno', findByTatuadorAndDate);
turnoRouter.get('/cliente/:cliente_dni', findByCliente);
turnoRouter.get('/tatuador/:tatuador_dni', findByTatuador);
turnoRouter.get('/tatuador/:tatuador_dni/current-month', findTurnosByTatuadorForCurrentMonth);