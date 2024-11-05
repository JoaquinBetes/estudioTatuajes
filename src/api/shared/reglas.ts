import { orm } from './db/orm.js'

const em =orm.em

// Verifica si el email cumple con el formato correcto
export function isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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
    return !( telefono.length < 7 || telefono.length > 20 )
    }

export async function controlRedes(redes: string): Promise<boolean> {
    // Verifica la longitud del teléfono)
    return ( redes.length < 400 )
    }

export async function controlDni(clase: any, dni: string): Promise<boolean> {
    if (dni.length > 8) {
        return false;
    }
    else return true;
    }
    