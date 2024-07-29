namespace backend.Models
{
    public class Quote
    {
        public int Id { get; set; }

        public string Year { get; set; }

        public string Makes { get; set; }

        public string Cost { get; set; }

        public string Model { get; set; }

        public string FullName { get; set; }

        public DateTime Birthdate { get; set; }

        public string Gender { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public decimal Price { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;

        public int UserId { get; set; }

        public User User { get; set; }

        public int InsuranceId { get; set; }
        public Insurance? Insurance { get; set; }

        public int CoverageId { get; set; }
        public Coverage? Coverage { get; set; }

    }
}
