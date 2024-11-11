import { Entity, OneToOne, ManyToOne, PrimaryKey, Property, Rel, Cascade } from "@mikro-orm/core";
import { Tatuador } from "../tatuador/tatuador.entity.js";
import { Diseño } from "../diseño/diseño.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";

@Entity()
export class Turno {
  @PrimaryKey({type: 'int', autoincrement: true }) // Debe ser un datetime
  id!: number; // Aquí sigue siendo Date, ya que la fecha es importante

  @Property({ type: 'date' }) // Debe ser un datetime
  fechaTurno!: Date; // Aquí sigue siendo Date, ya que la fecha es importante

  @Property({ type: 'time' }) // Guardar solo la hora
  horaInicio!: string; // Solo la hora de inicio

  @Property({ type: 'time' }) // Guardar solo la hora
  horaFin!: string; // Solo la hora de fin

  @ManyToOne(() => Tatuador) // Relación con Tatuador
  tatuador!: Rel<Tatuador>; // Tatuador asociado al turno TODO DEBERÍA SER PRIMARY KEY

  @ManyToOne(() => Cliente)
  cliente!: Cliente;

  @OneToOne(() => Diseño, { owner: true }) 
  diseño?: Rel<Diseño>; // Hacer opcional

  @Property({ type: 'string', length: 400 })
  indicaciones!: string;

  @Property({ type: 'string', length: 3 })
  estado!: string;
}
