import { Entity, OneToOne, ManyToOne, PrimaryKey, Property, Rel, Cascade } from "@mikro-orm/core";
import { Tatuador } from "../tatuador/tatuador.entity.js";
import { Diseño } from "../diseño/diseño.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";

@Entity()
export class Turno {
  @PrimaryKey() // Debe ser un datetime
  horaInicio!: Date;

  @PrimaryKey()
  horaFin!: Date;

  @PrimaryKey()
  fechaTurno!: Date;

  @ManyToOne(() => Tatuador) // Relación con Tatuador
  tatuador!: Rel<Tatuador>; // Tatuador asociado al turno TODO DEBERIA SER PRIMARY KEY

  @ManyToOne ( () => Cliente )
  cliente!: Cliente;

  @OneToOne(() => Diseño, { owner: true }) 
  diseño?: Rel<Diseño>; // Hacer opcional

  @Property( { type: 'string', length: 3 } )
  estado!: string;

}