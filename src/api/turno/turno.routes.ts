import { Router } from "express";
import {  findAll, findOne, add, update, remove,findByTatuadorAndDate, findByCliente, findByTatuador, findTurnosByTatuadorForCurrentMonth, findTurnosByTatuadorForLastThreeMonths, findAllTurnosForCurrentMonth, findAllTurnosForSpecificMonth} from "./turno.controller.js";

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
turnoRouter.get('/tatuador/:tatuador_dni/last-three-months', findTurnosByTatuadorForLastThreeMonths);
turnoRouter.get('/encargado/month/:mes', findAllTurnosForSpecificMonth);

