import { Entity, ManyToOne, PrimaryKey, Property, Rel} from "@mikro-orm/core";
import { Sucursal } from "../sucursal/sucursal.entity.js";


@Entity()
export class HorariosAtencion {
  @PrimaryKey( {type: 'int', autoincrement: true } )
  id?: number

  @ManyToOne ( () => Sucursal )
  sucursal!: Rel<Sucursal>;

  @Property ({ type: 'float'})
  horaApertura!: number;

  @Property ({ type: 'float'})
  horaCierre!: number;

  @Property({ type: 'string', length: 30 }) // varchar(30)
  diaSeamana!: string;

}