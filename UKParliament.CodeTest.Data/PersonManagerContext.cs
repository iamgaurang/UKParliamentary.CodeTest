﻿using Microsoft.EntityFrameworkCore;

namespace UKParliament.CodeTest.Data;

public class PersonManagerContext(DbContextOptions<PersonManagerContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Sales" },
            new Department { Id = 2, Name = "Marketing" },
            new Department { Id = 3, Name = "Finance" },
            new Department { Id = 4, Name = "HR" });
        modelBuilder.Entity<Person>().HasData(
            new Person
            {
                Id = 1, 
                FirstName = "John", 
                LastName = "Doe", 
                DepartmentId = 1, 
                DateOfBirth = new DateTime(1980, 01, 01),
            });
    }

    public DbSet<Person> People { get; set; }

    public DbSet<Department> Departments { get; set; }
}