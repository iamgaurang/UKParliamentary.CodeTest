using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using UKParliament.CodeTest.Web.Controllers;
using Xunit;

namespace UKParliament.CodeTest.Tests;

public class GlobalExceptionHandlerTests
{
    private readonly Mock<RequestDelegate> _mockNext;
    private readonly Mock<ILogger<GlobalExceptionHandler>> _mockLogger;
    private readonly GlobalExceptionHandler _middleware;

    public GlobalExceptionHandlerTests()
    {
        _mockNext = new Mock<RequestDelegate>();
        _mockLogger = new Mock<ILogger<GlobalExceptionHandler>>();
        _middleware = new GlobalExceptionHandler(_mockNext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task InvokeAsync_Returns500StatusCode_WhenExceptionOccurs()
    {
        var context = new DefaultHttpContext();
        var exception = new Exception("Test exception");

        _mockNext.Setup(next => next(It.IsAny<HttpContext>())).ThrowsAsync(exception);
        
        await _middleware.InvokeAsync(context);
        
        Assert.Equal(500, context.Response.StatusCode);
        Assert.Equal("application/json", context.Response.ContentType);
    }

    [Fact]
    public async Task InvokeAsync_PassesThrough_WhenNoExceptionOccurs()
    {
        var context = new DefaultHttpContext();
        var wasNextCalled = false;
        
        _mockNext.Setup(next => next(It.IsAny<HttpContext>())).Callback<HttpContext>(ctx =>
        {
            wasNextCalled = true;
        }).Returns(Task.CompletedTask);

        // Act
        await _middleware.InvokeAsync(context);
        
        Assert.True(wasNextCalled, "Next delegate was not called.");
        Assert.Equal(200, context.Response.StatusCode);
    }

    [Fact]
    public async Task InvokeAsync_SerializesErrorResponseCorrectly_WhenExceptionOccurs()
    {
        var context = new DefaultHttpContext();
        var exception = new Exception("Test exception");
        
        _mockNext.Setup(next => next(It.IsAny<HttpContext>())).ThrowsAsync(exception);
        
        using var memoryStream = new MemoryStream();
        context.Response.Body = memoryStream;
        
        await _middleware.InvokeAsync(context); 
        
        memoryStream.Seek(0, SeekOrigin.Begin); 
        using var reader = new StreamReader(memoryStream, Encoding.UTF8);
        var responseContent = await reader.ReadToEndAsync(); 
        
        Assert.Contains("message", responseContent); 
        Assert.Contains("An internal server error occurred.", responseContent);
        Assert.Contains("details", responseContent); 
        Assert.Contains("Test exception", responseContent); 
    }
}