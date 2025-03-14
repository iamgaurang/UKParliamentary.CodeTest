using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services.Repository;

public class DepartmentRepository(PersonManagerContext _context) : IDepartmentRepository
{
    public async Task<IEnumerable<Department>> GetAllAsync()
    {
        return await _context.Departments.ToListAsync();
    }
}