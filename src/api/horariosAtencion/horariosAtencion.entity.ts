import { Entity, ManyToOne, PrimaryKey, Property, Rel} from "@mikro-orm/core";
import { Sucursal } from "../sucursal/sucursal.entity.js";


@Entity()
export class HorariosAtencion {
  @PrimaryKey( {type: 'int', autoincrement: true } )
  id?: number

  @ManyToOne ( () => Sucursal )
  sucursal!: Rel<Sucursal>;

  @Property({ type: 'time' }) // Guardar solo la hora
  hora_apertura!: string; // Solo la hora de inicio

  @Property({ type: 'time' }) // Guardar solo la hora
  hora_cierre!: string; // Solo la hora de cierre

  @Property({ type: 'string', length: 30 }) // varchar(30)
  dia_semana!: string;

}