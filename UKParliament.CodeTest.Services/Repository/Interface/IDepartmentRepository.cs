using UKParliament.CodeTest.Data;
namespace UKParliament.CodeTest.Services.Repository;

public interface IDepartmentRepository
{
    Task<IEnumerable<Department>> GetAllAsync();
}