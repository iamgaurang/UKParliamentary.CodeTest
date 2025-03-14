using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services;

public interface IDepartmentService
{
    Task<IEnumerable<Department>> GetAllDepartmentsAsync();
}