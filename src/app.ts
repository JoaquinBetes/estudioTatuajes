import 'reflect-metadata';
import express from "express";

import { categoriaRouter } from './api/categoria/categoria.routes.js';
import { tatuadorRouter } from './api/tatuador/tatuador.routes.js';
import { clienteRouter } from './api/cliente/cliente.routes.js';
import { diseñoRouter } from './api/diseño/diseño.route.js';
import { liquidacionRouter } from './api/liquidacion/liquidacion.routes.js';
import { turnoRouter } from './api/turno/turno.routes.js';
import { politicasRouter } from './api/politicas/politicas.routes.js';
import { sucursalRouter } from './api/sucursal/sucursal.routes.js';
import { horariosAtencionRouter } from './api/horariosAtencion/horariosAtencion.routes.js'; 

import { orm, syncSchema } from './api/shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';

const app = express();
app.use(express.json());

// Luego de middlewares base

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

// Antes de las rutas y middlewares de negocio
app.use("/api/categoria", categoriaRouter)
app.use("/api/tatuador", tatuadorRouter)
app.use("/api/cliente", clienteRouter)
app.use("/api/liquidacion", liquidacionRouter)
app.use("/api/disenio", diseñoRouter)
app.use("/api/turno", turnoRouter)
app.use("/api/politicas", politicasRouter)
app.use("/api/sucursal", sucursalRouter)
app.use("/api/horariosAtencion", horariosAtencionRouter)

app.use((_, res) => {
  return res.status(404).send({message:"Resource not found"})
})

await syncSchema()

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
