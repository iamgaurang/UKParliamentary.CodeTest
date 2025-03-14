using System.ComponentModel.DataAnnotations;
using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services.Dtos;

public class PersonDto
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
    [CustomValidation(typeof(Person), nameof(Person.ValidateDateOfBirth))]
    public DateTime DateOfBirth { get; set; }
    [Required]
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
    public int CreatedBy { get; set; }
}