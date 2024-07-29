using AutoMapper;
using backend.Context;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.NetworkInformation;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly AppDbContext dbContext;
        private readonly IConfiguration configuration;

        public QuoteController(IMapper mapper, AppDbContext _dbContext, IConfiguration _configuration)
        {
            this.mapper = mapper;
            dbContext = _dbContext;
            configuration = _configuration;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerCotizaciones ()
        {
            var cotizaciones = await dbContext.Quotes.ToListAsync();
            var cotizacionesDto = mapper.Map<List<QuoteGetDto>>(cotizaciones);
            return Ok(cotizacionesDto);
        }

        [HttpGet("quotePreview")]
        public async Task<IActionResult> ObtenerVistaPrevia ([FromQuery] decimal cost, [FromQuery] int year)
        {
            if (cost <= 0 || year <= 0)
            {
                return BadRequest(new { message = "El costo y el año deben ser valores positivos." });
            }

            var fechaActual = DateTime.Now.Year;
            var fechaDelAuto = fechaActual - year;

            if (fechaDelAuto < 0)
            {
                return BadRequest(new { message = "El vehículo debe contar con al menos un año." });
            }

            var precioSeguro = (cost / fechaDelAuto) * 0.0035m;

            var ultimaCotizacion = await dbContext.Quotes.OrderByDescending(x => x.Id).FirstOrDefaultAsync();

            if(ultimaCotizacion == null)
            {
                return Ok(new { price = precioSeguro * 100, quoteId = 1 });
            }
            return Ok(new { price = precioSeguro * 100, quoteId = ultimaCotizacion.Id });
        }


        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> ObtenerCotizacion(int id)
        {
            var cotizacion = await dbContext.Quotes.FirstOrDefaultAsync(x => x.Id == id);
            
            if(cotizacion == null)
            {
                return NotFound(new { message = "Número de cotización no encontrada" });
            }

            var cotizacionDto = mapper.Map<QuoteGetDto>(cotizacion);
            return Ok(cotizacionDto);
        }


        [HttpPost]
        public async Task<IActionResult> CrearCotizacion([FromBody] QuotePostDto quotePostDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!int.TryParse(quotePostDto.InsuranceId, out int insuranceId))
            {
                return BadRequest(new { message = "El campo seguro no es un número válido." });
            }

            if (!int.TryParse(quotePostDto.CoverageId, out int coverageId))
            {
                return BadRequest(new { message = "El campo cobertura no es un número válido." });
            }

            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader == null || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Token no proporcionado" });
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == "nameid").Value;

                var quote = new Quote
                {
                    Year = quotePostDto.Year,
                    Makes = quotePostDto.Makes,
                    Cost = quotePostDto.Cost,
                    Model = quotePostDto.Model,
                    FullName = quotePostDto.FullName,
                    Birthdate = quotePostDto.Birthdate,
                    Gender = quotePostDto.Gender,
                    Email = quotePostDto.Email,
                    Phone = quotePostDto.Phone,
                    Price = quotePostDto.Price,
                    InsuranceId = insuranceId,
                    CoverageId = coverageId,
                    CreationDate = quotePostDto.CreationDate,
                    UserId = int.Parse(userId)
                };

                dbContext.Quotes.Add(quote);
                await dbContext.SaveChangesAsync();

                return Ok(new { message = "Cotización creada con éxito." });
            }
            catch (SecurityTokenException)
            {
                return Unauthorized(new { message = "No cuentas con la autorización para realizar esta acción." });
            }
        }

    }
}
