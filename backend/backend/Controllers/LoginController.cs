using backend.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Models.Dto;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/auth/")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration configuration;
        private readonly ITokenBlacklistService tokenBlacklistService;

        public LoginController(AppDbContext _dbContext, IConfiguration _configuration, ITokenBlacklistService _tokenBlacklistService)
        {
            dbContext = _dbContext;
            configuration = _configuration;
            tokenBlacklistService = _tokenBlacklistService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginPostDto loginPostDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == loginPostDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginPostDto.Password, user.Password))
            {
                return Unauthorized(new { message = "Credenciales incorrectas" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { 
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.RoleId.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { token = tokenString});
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Invalid token");
            }

            tokenBlacklistService.AddTokenToBlackList(token);

            return Ok(new { message = "Sesión finalizada." });
        }
    }
}
