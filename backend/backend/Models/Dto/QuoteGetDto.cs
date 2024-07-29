namespace backend.Models.Dto
{
    public class QuoteGetDto
    {
        public int Id { get; set; }

        public string Cost { get; set; }

        public int CoverageId { get; set; }

        public string Email { get; set; }

        public string FullName { get; set; }

        public string Birthdate { get; set; }
        public string Gender { get; set; }

        public int InsuranceId { get; set; }

        public string Makes { get; set; }

        public string Model { get; set; }
        public string Phone { get; set; }

        public string Year { get; set; }

        public decimal Price { get; set; }
        public DateTime CreationDate { get; set; }

    }
}
