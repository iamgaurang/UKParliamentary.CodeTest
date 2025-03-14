using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services.Repository;

namespace UKParliament.CodeTest.Services;

public class DepartmentService(IDepartmentRepository departmentRepository): IDepartmentService
{
    public async Task<IEnumerable<Department>> GetAllDepartmentsAsync()
    {
        return await departmentRepository.GetAllAsync();
    }
}