import {z} from 'zod';

export const registerSchema = z.object({
    name:  z.string().min(3, {message: "El campo nombre es requerido"}),
    email:  z.string().email({message: "El correo ingresado no es válido"}),
    password:  z.string().min( 5, {message: "El campo contraseña debe tener mínimo 5 caracteres"}),   
    confirmPassword: z.string().min(5, "El campo confirmar contraseña debe tener mínimo 5 caracteres"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"], 
});