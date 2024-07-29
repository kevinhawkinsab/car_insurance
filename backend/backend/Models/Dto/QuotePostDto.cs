using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace backend.Models.Dto
{
    public class QuotePostDto
    {

        [Required(ErrorMessage = "El campo costo del vehículo es requerido.")]
        public string Cost { get; set; }

        [Required(ErrorMessage = "El campo cobertura es requerido.")]
        public string CoverageId { get; set; }

        [Required(ErrorMessage = "El campo correo electrónico es requerido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El campo nombre completo es requerido.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "El campo fecha de nacimiento es requerido.")]
        public DateTime Birthdate { get; set; }

        [Required(ErrorMessage = "El campo género es requerido.")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "El campo seguro es requerido.")]
        public string InsuranceId { get; set; }

        [Required(ErrorMessage = "El campo marca del vehículo es requerido.")]
        public string Makes { get; set; }

        [Required(ErrorMessage = "El campo modelo del vehículo es requerido.")]
        public string Model { get; set; }

        public string Phone { get; set; }

        [Required(ErrorMessage = "El campo año del vehículo es requerido.")]
        public string Year { get; set; }

        [Required(ErrorMessage = "El campo precio de cotización es requerido.")]
        public decimal Price { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.Now;
    }
}
