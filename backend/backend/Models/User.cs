﻿namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; }

        public ICollection<Quote> Quotes { get; set; } = new List<Quote> ();
    }
}
