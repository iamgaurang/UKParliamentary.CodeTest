using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services.Dtos;

namespace UKParliament.CodeTest.Services;

public interface IPersonService
{
    Task<IEnumerable<PersonDto>> GetAllPeopleAsync();
    Task<PersonDto?> GetPersonByIdAsync(int id);
    Task AddPersonAsync(PersonDto person);
    Task UpdatePersonAsync(PersonDto person);
    Task DeletePersonAsync(int id);
}