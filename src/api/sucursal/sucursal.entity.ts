import { Entity, OneToMany, PrimaryKey, Property, Collection, Cascade  } from "@mikro-orm/core";
import { HorariosAtencion } from "../horariosAtencion/horariosAtencion.entity.js";


@Entity()
export class Sucursal {
  @PrimaryKey( {type: 'int', autoincrement: true } )
  id?: number

  @Property({ type: 'string', length: 60 }) // varchar(60)
  pais!: string;

  @Property({ type: 'string', length: 100 }) // varchar(100)
  localidad!: string;

  @Property({ type: 'string', length: 200 }) // varchar(200)
  direccion!: string;

  @Property({ type: 'string', length: 30 }) // varchar(30)
  departamento!: string;

  @Property ({ type: 'int'})
  piso!: number;

  @OneToMany( () => HorariosAtencion, horariosAtencion => horariosAtencion.sucursal, { cascade: [Cascade.REMOVE] })
  horariosAtenciones = new Collection<HorariosAtencion>(this);

}