import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Politicas {
  @PrimaryKey( {type: 'int', autoincrement: true } )
  id?: number

  @Property ({ type: 'float'})
  precioBaseMinimo!: number;

  @Property ({ type: 'float'})
  descuentoMaximo!: number;

  @Property ({ type: 'float'})
  comisionesEstudio!: number;

}