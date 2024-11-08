import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Rel, Cascade } from "@mikro-orm/core";
import { Categoria } from "../categoria/categoria.entity.js";
import { Tatuador } from "../tatuador/tatuador.entity.js";
import { Turno } from "../turno/turno.entity.js";

@Entity()
export class Diseño {
  @PrimaryKey({ type: 'int', autoincrement: true })
  id?: number;

  @ManyToOne(() => Categoria)
  categoria!: Rel<Categoria>;

  @ManyToOne(() => Tatuador)
  tatuador!: Rel<Tatuador>;

  @OneToOne(() => Turno, turno => turno.diseño, { cascade: [Cascade.REMOVE], nullable: true }) 
  turno?: Rel<Turno>; // Hacer opcional el turno

  @Property({ type: 'int' })
  tamanioAproximado?: number;

  @Property({ type: 'string', length: 300 }) 
  imagen!: string; 

  @Property({ type: 'float' })
  precioBase!: number;

  @Property({ type: 'float' })
  descuento!: number;

  @Property({ type: 'int' })
  precioFinal!: number;

  @Property({ type: 'string', length: 300 }) // varchar(300)
  colores!: string;

  @Property({ type: 'string', length: 3 }) // varchar(300)
  estado!: string;
}
