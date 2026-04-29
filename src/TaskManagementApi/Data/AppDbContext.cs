using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Models;

namespace TaskManagementApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(user => user.Id);
            entity.Property(user => user.FullName)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(user => user.Email)
                .IsRequired()
                .HasMaxLength(256);
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.PasswordHash)
                .IsRequired();
            entity.Property(user => user.CreatedAt)
                .IsRequired();
        });

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(task => task.Id);
            entity.Property(task => task.Title)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(task => task.Description)
                .HasMaxLength(2000);
            entity.Property(task => task.IsCompleted)
                .IsRequired();
            entity.Property(task => task.CreatedAt)
                .IsRequired();
            entity.Property(task => task.UpdatedAt)
                .IsRequired();

            entity.HasOne(task => task.User)
                .WithMany(user => user.Tasks)
                .HasForeignKey(task => task.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(task => new { task.UserId, task.IsCompleted });
            entity.HasIndex(task => new { task.UserId, task.CreatedAt });
        });
    }
}