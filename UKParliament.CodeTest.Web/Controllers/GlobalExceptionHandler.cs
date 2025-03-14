using System.Text.Json;

namespace UKParliament.CodeTest.Web.Controllers;

public class GlobalExceptionHandler(RequestDelegate _next, ILogger<GlobalExceptionHandler> _logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            _logger.LogInformation("Request started: {Path}", context.Request.Path);
            
            Console.WriteLine("Before next middleware...");
            
            await _next(context);
            
            _logger.LogInformation("Request completed successfully: {Path}", context.Request.Path);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred while processing request for {Path}", context.Request.Path);
            Console.WriteLine($"Exception caught: {ex.Message}");
            
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;
            var response = new { message = "An internal server error occurred.", details = ex.Message };
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}