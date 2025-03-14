using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services.Repository;

public class PersonRepository(PersonManagerContext _context) : IPersonRepository
{
    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _context.People
            .AsNoTracking()
            .Include(p => p.Department)
            .ToListAsync();
    }

    public async Task<Person?> GetByIdAsync(int id)
    {
        return await _context.People
            .AsNoTracking()
            .Include(p => p.Department)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task AddAsync(Person person)
    {
        if (person == null) throw new ArgumentNullException(nameof(person));

        try
        {
            _context.People.Add(person);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine($"Error adding person: {ex.Message}");
            throw;
        }
    }

    public async Task UpdateAsync(Person person)
    {
        if (person == null) throw new ArgumentNullException(nameof(person));

        try
        {
            _context.People.Update(person);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine($"Error updating person: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var person = await _context.People.FindAsync(id);
        if (person == null) return false;

        try
        {
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine($"Error deleting person: {ex.Message}");
            throw;
        }
    }
}
