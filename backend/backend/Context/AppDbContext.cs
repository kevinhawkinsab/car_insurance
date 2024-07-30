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


            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Administrador" },
                new Role { Id = 2, Name = "Cliente" }
            );

            modelBuilder.Entity<Coverage>().HasData(
                new Coverage { Id = 1, Name = "Resp. civil", Description = "Cobertura básica que protege contra daños a terceros en sus bienes o personas, pero no cubre daños al vehículo propio." },
                new Coverage { Id = 2, Name = "Limitada", Description = "Incluye responsabilidad civil y protege contra robo total del vehículo y daños por desastres naturales, sin cubrir daños propios por colisiones." },
                new Coverage { Id = 3, Name = "Amplia", Description = "Cobertura completa que incluye responsabilidad civil, daños a terceros, robo total, desastres naturales, y daños propios por colisiones y accidentes." }
            );


            modelBuilder.Entity<Insurance>().HasData(
                new Insurance { Id = 1, Name = "Cobertura completa", Description = "Cubre los daños causados a otras personas y también los de tu auto, a consecuencia de un evento o accidente, como: colisión, vuelco, robo, incendio, inundación y otros desastres naturales." },
                new Insurance { Id = 2, Name = "Daños a terceros", Description = "Cubre únicamente las lesiones corporales y daños causados al auto o propiedades de otras personas en un accidente de tránsito." }
            );
        }
    }
}
