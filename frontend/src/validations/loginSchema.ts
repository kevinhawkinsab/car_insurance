import {z} from 'zod';

export const loginSchema = z.object({
    email:  z.string().email({message: "El correo ingresado no es válido"}),
    password:  z.string().min( 5, {message: "El campo contraseña no es válido"}),  
});