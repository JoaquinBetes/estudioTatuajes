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
    if ((dni.length > 8) || (dni.length < 6)) {
        return false;
    }
    else return true;
    }

export function controlLongitud( data: string, long: number ): boolean {
    return (data.length <= long)
}

export function controlEntero(data: any): boolean {
    try {
      const valor = parseInt(data, 10); // Intentamos convertir la cadena a número entero
      if (Number.isInteger(valor) && valor < 100) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false; // Si hay un error, retornamos false
    }
  }

  export function validarHora(hora: number): boolean {
    try {
      // Convertir el número a cadena
      const horaString = hora.toString();
      const [horaEntera, minutosSegundos] = horaString.split('.')
      // Verificar que la parte de horas sea un número entero válido entre 0 y 23
      const horas = parseInt(horaEntera, 10);
      if (isNaN(horas) || horas < 0 || horas >= 24) {
        return false; // Si las horas no son un número válido o están fuera del rango [0-23], retorno false
      }
      // Si no hay parte decimal, entonces solo debe ser un valor de horas entero válido
      if (!minutosSegundos) {
        return true; // Si no hay decimales, es una hora válida
      }
      // Asegurarse de que los minutos estén en el rango [0-59]
      if (minutosSegundos.length > 2) {
        return false; // Si tiene más de dos decimales, es un formato inválido
      }
      const minutos = parseInt(minutosSegundos.substring(0, 2), 10);
      if (minutos < 0 || minutos > 59) {
        return false; // Si los minutos no están en el rango [0-59], es inválido
      }
      return true; // Si pasó todas las verificaciones, es válido
    } catch (error) {
      return false; // En caso de error, retornamos false
    }
  }

  export function controlEstado( data: string): boolean {
    return (data === "dis" || data === "res" || data === "tat" )
}

  export function clienteEstado( data: number ): boolean{
    return (data < 3)
  }
  export function esNumero(valor: any): boolean {
    return Number.isFinite(valor);
  }
  