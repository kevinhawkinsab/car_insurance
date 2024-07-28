using System.ComponentModel.DataAnnotations;

namespace backend.Models.Dto
{
    public class LoginPostDto
    {
        [Required(ErrorMessage = "El campo correo electrónico es requerido.")]
        [EmailAddress(ErrorMessage = "El correo electrónico ingresado no es una dirección de correo electrónico válida.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El campo contraseña es requerido.")]
        public string Password { get; set; }
    }
}
