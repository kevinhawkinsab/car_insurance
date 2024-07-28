using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Insurance> Insurances { get; set; }
        public DbSet<Coverage> Coverages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(col =>
            {
                col.HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Quote>(col =>
            {
                col.HasOne(q => q.User).WithMany(u => u.Quotes).HasForeignKey(q => q.UserId).OnDelete(DeleteBehavior.Restrict);

                col.HasOne(q => q.Insurance).WithMany(i => i.Quotes).HasForeignKey(q => q.InsuranceId).OnDelete(DeleteBehavior.Restrict);

                col.HasOne(q => q.Coverage).WithMany(c => c.Quotes).HasForeignKey(q => q.CoverageId).OnDelete(DeleteBehavior.Restrict);
                col.Property(q => q.Price).HasPrecision(18, 2);
                col.Property(q => q.CreationDate).HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<Quote>().ToTable("Quotes");
            modelBuilder.Entity<Insurance>().ToTable("Insurances");
            modelBuilder.Entity<Coverage>().ToTable("Coverages");
        }
    }
}
