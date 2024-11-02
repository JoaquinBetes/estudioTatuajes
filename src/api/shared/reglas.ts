import { orm } from './db/orm.js'

const em =orm.em

export async function controlPK(clase: any, pk: number): Promise<boolean> {
    // Busca un registro por clave primaria
    const result = await em.findOne(clase, pk);
    return result === null; // Devuelve true si no existe, false si existe
}

export async function controlEmail(clase: any, email: string): Promise<boolean> {
    const result = await em.findOne(clase, { email }); // Busca un único registro con el email proporcionado
    return result === null; // Retorna true si no encuentra el email, false si ya existe
}

export async function controlTelyPass(clase: any, telefono: string): Promise<boolean> {
    // Verifica la longitud del teléfono
    if (telefono.length < 7 || telefono.length > 20) {
        return false;
    }
    else return true;
    }
export async function controlDni(clase: any, dni: string): Promise<boolean> {
    // Verifica la longitud del teléfono
    if (dni.length > 8) {
        return false;
    }
    else return true;
    }
    