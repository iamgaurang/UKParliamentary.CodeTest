using Microsoft.AspNetCore.Mvc;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Services.Dtos;

namespace UKParliament.CodeTest.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonController(IPersonService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var people = await service.GetAllPeopleAsync();
        return Ok(people);
    }
    
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var person = await service.GetPersonByIdAsync(id);
        if (person is null) return NotFound();
        return Ok(person);
    }

    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] PersonDto person)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        await service.AddPersonAsync(person);
        return CreatedAtAction(nameof(GetById), new { id = person.Id }, person);
    }

    [HttpPut("Update")]
    public async Task<IActionResult> Update([FromBody] PersonDto person)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        await service.UpdatePersonAsync(person);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.DeletePersonAsync(id);
        return NoContent();
    }
}