using Mapster;
using Microsoft.Extensions.DependencyInjection;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services.Dtos;

namespace UKParliament.CodeTest.Services.MapConfig;

public class PersonMappingConfig
{
    public static void RegisterMappings(IServiceCollection services)
    {
        TypeAdapterConfig<Person, PersonDto>.NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.FirstName, src => src.FirstName)
            .Map(dest => dest.LastName, src => src.LastName)
            .Map(dest => dest.DateOfBirth, src => src.DateOfBirth)
            .Map(dest => dest.DepartmentName, src => src.Department.Name);
        
        TypeAdapterConfig<PersonDto, Person>.NewConfig()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.FirstName, src => src.FirstName)
            .Map(dest => dest.LastName, src => src.LastName)
            .Map(dest => dest.DateOfBirth, src => src.DateOfBirth);
    }
}