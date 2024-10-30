import { Entity, OneToMany, PrimaryKey, Property, Collection, Cascade } from "@mikro-orm/core";
import { Turno } from "../turno/turno.entity.js";

@Entity()
export class Cliente {
  @PrimaryKey( {type: 'int', autoincrement: false } )
  dni?: number

  @Property({ type: 'string', length: 60 }) // varchar(60)
  nombreCompleto!: string;

  @Property({ type: 'string', length: 40 }) // varchar(40)
  email!: string;

  @Property({ type: 'string', length: 20 }) 
  telefono!: string;

  @Property({ type: 'int' }) 
  estado!: number;

  @OneToMany( () => Turno, turno => turno.cliente, { cascade: [Cascade.REMOVE] })
  turnos = new Collection<Turno>(this);

}
