using Mapster;
using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Services.Dtos;
using UKParliament.CodeTest.Services.Repository;
using Xunit;

namespace UKParliament.CodeTest.Tests;

public class PersonServiceTests
{
    private readonly Mock<IPersonRepository> _mockPersonRepository;
    private readonly PersonService _personService;

    public PersonServiceTests()
    {
        _mockPersonRepository = new Mock<IPersonRepository>();
        _personService = new PersonService(_mockPersonRepository.Object);
    }
    
    [Fact]
        public async Task GetAllPeopleAsync_ReturnsMappedPeopleDtos()
        {
            var people = new List<Person>
            {
                new Person { Id = 1, FirstName = "John", LastName = "Doe" },
                new Person { Id = 2, FirstName = "Mane", LastName = "Moe"}
            };

            _mockPersonRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(people);
            
            var result = await _personService.GetAllPeopleAsync();
            
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, dto => Assert.IsType<PersonDto>(dto));
            Assert.Equal("John", result.First().FirstName);
        }

        [Fact]
        public async Task GetPersonByIdAsync_ReturnsMappedPersonDto()
        {
            var person = new Person { Id = 1, FirstName = "John", LastName = "Doe" };
            _mockPersonRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(person);
            
            var result = await _personService.GetPersonByIdAsync(1);

            Assert.NotNull(result);
            Assert.IsType<PersonDto>(result);
            Assert.Equal("John", result?.FirstName);
        }

        [Fact]
        public async Task AddPersonAsync_CallsAddAsyncOnRepository()
        {
            var personDto = new PersonDto { FirstName = "John", LastName = "Doe" };
            var personEntity = personDto.Adapt<Person>();  // Map the DTO to the entity

            _mockPersonRepository.Setup(repo => repo.AddAsync(It.IsAny<Person>())).Returns(Task.CompletedTask);
            
            await _personService.AddPersonAsync(personDto);

            _mockPersonRepository.Verify(repo => repo.AddAsync(It.Is<Person>(p => p.FirstName == "John")), Times.Once);
        }

        [Fact]
        public async Task UpdatePersonAsync_CallsUpdateAsyncOnRepository()
        {
            var personDto = new PersonDto { Id = 1, FirstName = "John Doe Updated" };
            var personEntity = personDto.Adapt<Person>();

            _mockPersonRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Person>())).Returns(Task.CompletedTask);
            
            await _personService.UpdatePersonAsync(personDto);
            
            _mockPersonRepository.Verify(repo => repo.UpdateAsync(It.Is<Person>(p => p.Id == 1 && p.FirstName == "John Doe Updated")), Times.Once);
        }

        [Fact]
        public async Task DeletePersonAsync_CallsDeleteAsyncOnRepository()
        {
            // Arrange
            var id = 1;
            _mockPersonRepository.Setup(repo => repo.DeleteAsync(It.IsAny<int>())).ReturnsAsync(true);

            // Act
            await _personService.DeletePersonAsync(id);

            // Assert
            _mockPersonRepository.Verify(repo => repo.DeleteAsync(id), Times.Once);
        }
}