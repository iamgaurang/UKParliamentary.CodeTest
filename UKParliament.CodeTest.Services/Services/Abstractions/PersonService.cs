using Mapster;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services.Dtos;
using UKParliament.CodeTest.Services.Repository;

namespace UKParliament.CodeTest.Services;

public class PersonService(IPersonRepository _personRepository) : IPersonService
{
    public async Task<IEnumerable<PersonDto>> GetAllPeopleAsync()
    {
        var people = await _personRepository.GetAllAsync();
        return people.Adapt<IEnumerable<PersonDto>>();
    }

    public async Task<PersonDto?> GetPersonByIdAsync(int id)
    {
        var person = await _personRepository.GetByIdAsync(id);
        return person?.Adapt<PersonDto>();
    }

    public async Task AddPersonAsync(PersonDto person)
    {
        var personEntity = person.Adapt<Person>();
        await _personRepository.AddAsync(personEntity);
    }

    public async Task UpdatePersonAsync(PersonDto person)
    {
        var personEntity = person.Adapt<Person>();
        await _personRepository.UpdateAsync(personEntity);
    }

    public async Task DeletePersonAsync(int id)
    {
        await _personRepository.DeleteAsync(id);
    }
}