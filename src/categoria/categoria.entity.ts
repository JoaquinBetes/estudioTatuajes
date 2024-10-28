import { Entity, OneToMany, PrimaryKey, Property, Collection, Rel, Cascade } from "@mikro-orm/core";
import { Diseño } from "../diseño/diseño.entity.js";

@Entity()
export class Categoria {
  @PrimaryKey( {type: 'int', autoincrement: true } )
  codigo?: number

  @Property({ type: 'string', length: 250 }) // varchar(250)
  descripcion!: string;

  @OneToMany( () => Diseño, diseño => diseño.categoria, { cascade: [Cascade.REMOVE] })
  diseños = new Collection<Diseño>(this);

}
