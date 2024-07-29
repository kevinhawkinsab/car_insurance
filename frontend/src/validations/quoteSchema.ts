import {z} from 'zod';
const genderList = ["female", "male"] as const;

export const quoteSchema = z.object({
    birthdate: z.preprocess(
        (arg) => {
          if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        },
        z.date({ message: "El campo fecha de nacimiento es requerido" })
    ),
    cost:  z.string().min(1, {message: "El campo costo es requerido"}),
    coverageId:  z.string().min(1, {message: "El campo cobertura es requerido"}),
    email:  z.string().email({message: "El correo ingresado no es válido"}),
    fullName:  z.string().min(2, {message: "El campo nombre es requerido"}),
    gender:  z.enum(genderList, {
        errorMap: () => ({message: "Selecciona un género"})
    }),
    insuranceId:  z.string().min(1, {message: "El campo seguro es requerido"}),
    makes:  z.string().min(1, {message: "El campo marca es requerido"}),
    model:  z.string().min(1, {message: "El campo modelo es requerido"}),  
    phone:  z.string(),
    year:  z.string().refine(year => !isNaN(parseInt(year))),
});