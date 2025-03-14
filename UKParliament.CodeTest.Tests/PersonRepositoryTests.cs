using Microsoft.EntityFrameworkCore;
using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services.Repository;
using Xunit;

namespace UKParliament.CodeTest.Tests;

public class PersonRepositoryTests
{
    private readonly PersonManagerContext _context;
        private readonly PersonRepository _repository;

        public PersonRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<PersonManagerContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new PersonManagerContext(options);
            _context.Database.EnsureCreated();
            
            if (!_context.Departments.Any())
            {
                _context.Departments.Add(new Department 
                { 
                    Id = 1, 
                    Name = "Test Department" 
                });
            }
            if (!_context.People.Any())
            {
                _context.People.Add(new Person 
                { 
                    Id = 1, 
                    FirstName = "John", 
                    LastName = "Doe", 
                    DateOfBirth = new DateTime(1990, 1, 1), 
                    DepartmentId = 1 
                });
            }
            _context.SaveChanges();

            _repository = new PersonRepository(_context);
        }

        [Fact]
        public async Task AddAsync_AddsPerson()
        {
            var newPerson = new Person 
            { 
                Id = 5, 
                FirstName = "Mane", 
                LastName = "Smith", 
                DateOfBirth = new DateTime(1995, 5, 10), 
                DepartmentId = 1 
            };
            
            await _repository.AddAsync(newPerson);
            var result = await _repository.GetByIdAsync(newPerson.Id);
            
            Assert.NotNull(result);
            Assert.Equal("Mane", result.FirstName);
        }
        
        [Fact]
        public async Task GetAllAsync_ReturnsAllPersons()
        {
            var result = await _repository.GetAllAsync();
            
            Assert.NotNull(result);
            Assert.Single(result);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsPerson_WhenExists()
        {
            var result = await _repository.GetByIdAsync(1);
            
            Assert.NotNull(result);
            Assert.Equal("John", result.FirstName);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenNotExists()
        {
            var result = await _repository.GetByIdAsync(99);
            Assert.Null(result);
        }
        
        [Fact]
        public async Task UpdateAsync_UpdatesPerson()
        {
            var person = await _repository.GetByIdAsync(1);
            Assert.NotNull(person);
            
            person.FirstName = "UpdatedName";
            await _repository.UpdateAsync(person);
            var updatedPerson = await _repository.GetByIdAsync(1);
            
            Assert.Equal("UpdatedName", updatedPerson.FirstName);
        }

        [Fact]
        public async Task DeleteAsync_RemovesPerson_WhenExists()
        {
            var result = await _repository.DeleteAsync(1);
            var deletedPerson = await _repository.GetByIdAsync(1);
            
            Assert.True(result);
            Assert.Null(deletedPerson);
        }
}