namespace backend.Models
{
    public class Coverage
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ICollection<Quote> Quotes { get; set; } = new List<Quote>();
    }
}
