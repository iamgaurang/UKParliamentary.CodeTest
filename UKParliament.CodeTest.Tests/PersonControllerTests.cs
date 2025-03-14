using Microsoft.AspNetCore.Mvc;
using Moq;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Services.Dtos;
using UKParliament.CodeTest.Web.Controllers;
using Xunit;

namespace UKParliament.CodeTest.Tests;

public class PersonControllerTests
{
    private readonly Mock<IPersonService> _mockPersonService;
    private readonly PersonController _controller;

    public PersonControllerTests()
    {
        _mockPersonService = new Mock<IPersonService>();
        _controller = new PersonController(_mockPersonService.Object);
    }
    
    [Fact]
    public async Task GetAll_ReturnsOkResult_WithPeople()
    {
        var people = new List<PersonDto>
        {
            new PersonDto { Id = 1, FirstName = "John", LastName = "Doe" },
            new PersonDto { Id = 2, FirstName = "Mane", LastName = "Moe"}
        };

        _mockPersonService.Setup(service => service.GetAllPeopleAsync()).ReturnsAsync(people);
        
        var result = await _controller.GetAll();
        
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsAssignableFrom<List<PersonDto>>(okResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetById_ReturnsOkResult_WhenPersonExists()
    {
        var person = new PersonDto { Id = 1, FirstName = "John", LastName = "Doe"  };
        _mockPersonService.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync(person);
        
        var result = await _controller.GetById(1);
        
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsAssignableFrom<PersonDto>(okResult.Value);
        Assert.Equal(1, returnValue.Id);
        Assert.Equal("John", returnValue.FirstName);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenPersonDoesNotExist()
    {
        _mockPersonService.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync((PersonDto)null);
        
        var result = await _controller.GetById(1);
        
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenModelIsValid()
    {
        var person = new PersonDto { Id = 1, FirstName = "John", LastName = "Doe" };
        _mockPersonService.Setup(service => service.AddPersonAsync(person)).Returns(Task.CompletedTask);
        
        var result = await _controller.Create(person);
        
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(PersonController.GetById), createdAtActionResult.ActionName);
        Assert.Equal(1, createdAtActionResult.RouteValues["id"]);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenModelIsInvalid()
    {
        var person = new PersonDto { Id = 1, FirstName = "", LastName = ""  }; // Invalid model (name is empty)
        _controller.ModelState.AddModelError("Name", "Name is required");
        
        var result = await _controller.Create(person);
        
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNoContent_WhenModelIsValid()
    {
        var person = new PersonDto { Id = 1, FirstName = "John", LastName = "Doe" };
        _mockPersonService.Setup(service => service.UpdatePersonAsync(person)).Returns(Task.CompletedTask);
        
        var result = await _controller.Update(person);
        
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenModelIsInvalid()
    {
        var person = new PersonDto { Id = 1, FirstName = "", LastName = ""  }; // Invalid model
        _controller.ModelState.AddModelError("Name", "Name is required");
        
        var result = await _controller.Update(person);
        
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.IsAssignableFrom<SerializableError>(badRequestResult.Value);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenPersonIsDeleted()
    {
        _mockPersonService.Setup(service => service.DeletePersonAsync(1)).Returns(Task.CompletedTask);
        
        var result = await _controller.Delete(1);
        
        Assert.IsType<NoContentResult>(result);
    }
}