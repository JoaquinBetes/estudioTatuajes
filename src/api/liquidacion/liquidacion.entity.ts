import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Tatuador } from "../tatuador/tatuador.entity.js";


@Entity()
export class Liquidacion {
  @PrimaryKey( {type: 'int', autoincrement: true } )
  id?: number

  @ManyToOne(() => Tatuador)
  tatuador!: Rel<Tatuador>;

  @Property({ type: 'date' }) 
  fechaInicioLiquidacion!: Date

  @Property({ type: 'date' }) 
  fechaFinLiquidacion!: Date

  @Property({ type: 'float' }) 
  valorTotal!: number

}