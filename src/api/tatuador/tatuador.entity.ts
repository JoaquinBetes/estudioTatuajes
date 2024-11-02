import { Entity, OneToMany, PrimaryKey, Property, Collection, Cascade } from "@mikro-orm/core";
import { Liquidacion } from "../liquidacion/liquidacion.entity.js";
import { Diseño } from "../diseño/diseño.entity.js";
import { Turno } from "../turno/turno.entity.js";

@Entity()
export class Tatuador {
  @PrimaryKey( {type: 'int', autoincrement: false } )
  dni?: number

  @Property({ type: 'string', length: 60 }) // varchar(60)
  nombreCompleto!: string;

  @Property({ type: 'string', length: 40 }) // varchar(40)
  email!: string;

  @Property({ type: 'string', length: 20 }) // varchar(20)
  telefono!: string;

  @Property({ type: 'string', length: 400 }) // varchar(400)
  redesSociales!: string;

  @OneToMany( () => Liquidacion, liquidacion => liquidacion.tatuador, { cascade: [Cascade.REMOVE] })
  liquidaciones = new Collection<Liquidacion>(this);

  @OneToMany( () => Diseño, diseño => diseño.tatuador, { cascade: [Cascade.REMOVE] })
  diseños = new Collection<Diseño>(this);

  @Property({ type: 'string', length: 20, nullable:false }) 
  contraseña!: string;

  @OneToMany( () => Turno, turno => turno.tatuador, { cascade: [Cascade.REMOVE] })
  turnos = new Collection<Turno>(this);

}