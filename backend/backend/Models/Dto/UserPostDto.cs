namespace backend.Models.Dto;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

public class UserPostDto
{
    [Required(ErrorMessage = "El campo nombre completo es requerido.")]
    public string Name {  get; set; }

    [Required(ErrorMessage = "El campo correo electrónico es requerido.")]
    [EmailAddress(ErrorMessage = "El correo electrónico ingresado no es una dirección de correo electrónico válida.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "El campo contraseña es requerido.")]
    [StringLength(255, ErrorMessage = "La contraseña debe tener entre 5 y 255 caracteres.", MinimumLength = 5)]
    public string Password { get; set; }
}
