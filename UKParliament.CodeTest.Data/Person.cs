using System.ComponentModel.DataAnnotations;

namespace UKParliament.CodeTest.Data;

public class Person
{
    public int Id { get; set; }
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }
    [Required]
    [StringLength(50)]
    public string LastName { get; set; }
    [Required]
    [DataType(DataType.Date)]
    [CustomValidation(typeof(Person), nameof(ValidateDateOfBirth))]
    public DateTime DateOfBirth { get; set; }
    [Required]
    public int DepartmentId { get; set; }
    public Department Department { get; set; }
    
    public static ValidationResult? ValidateDateOfBirth(DateTime dob, ValidationContext context)
    {
        if (dob > DateTime.UtcNow)
            return new ValidationResult("Date of birth cannot be in the future.");
        if ((DateTime.UtcNow - dob).TotalDays / 365 < 18)
            return new ValidationResult("Person must be at least 18 years old.");
        return ValidationResult.Success;
    }
}