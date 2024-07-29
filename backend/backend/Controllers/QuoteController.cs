using AutoMapper;
using backend.Context;
using backend.EncryptService;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
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
        public async Task<IActionResult> ObtenerCotizaciones()
        {
            var cryptokey = "A3B2C4D5E6F7G8H9";
            var cotizaciones = await dbContext.Quotes.ToListAsync();
            var cotizacionesDto = cotizaciones.Select(c => new QuoteGetDto
            {
                Year = c.Year,
                Makes = c.Makes,
                Cost = c.Cost,
                Model = c.Model,
                Birthdate = c.Birthdate,
                FullName = DecryptString(c.FullName, cryptokey),
                Gender = DecryptString(c.Gender, cryptokey),
                Email = DecryptString(c.Email, cryptokey),
                Phone = DecryptString(c.Phone, cryptokey),
                Price = c.Price,
                InsuranceId = c.InsuranceId,
                CoverageId = c.CoverageId,
                CreationDate = c.CreationDate,
            }).ToList();

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

            if (year > fechaActual)
            {
                return BadRequest(new { message = "El año del vehículo no puede ser mayor al año actual." });
            }


            var fechaDelAuto = fechaActual - year;

            if (fechaDelAuto <= 0)
            {
                return BadRequest(new { message = "El año del vehículo no puede ser el año actual." });
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
        [Route("user/{userId:int}/quotes")]
        public async Task<IActionResult> ObtenerCotizacion(int userId)
        {
            var cotizaciones = await dbContext.Quotes.Where(x => x.UserId == userId).ToListAsync();
            
            if(cotizaciones == null || !cotizaciones.Any())
            {
                return NotFound(new { message = "No se encontraron cotizaciones para este usuario." });
            }

            var cotizacionesDto = mapper.Map<List<QuoteGetDto>>(cotizaciones);
            return Ok(cotizacionesDto);
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
            var cryptokey = "A3B2C4D5E6F7G8H9";

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
                    Birthdate = quotePostDto.Birthdate,
                    FullName = EncryptString(quotePostDto.FullName, cryptokey),
                    Gender = EncryptString(quotePostDto.Gender, cryptokey),
                    Email = EncryptString(quotePostDto.Email, cryptokey),
                    Phone = EncryptString(quotePostDto.Phone, cryptokey),
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

        public static string EncryptString(string plainText, string key)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(key);

                aesAlg.GenerateIV();
                byte[] iv = aesAlg.IV;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, iv);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    msEncrypt.Write(iv, 0, iv.Length);

                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(plainText);
                    }

                    return Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
        }

        public static string DecryptString(string cipherText, string key)
        {
            byte[] fullCipher = Convert.FromBase64String(cipherText);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(key);

                int ivLength = aesAlg.BlockSize / 8;
                if (fullCipher.Length < ivLength)
                {
                    throw new ArgumentException("El texto cifrado no contiene suficiente información para extraer el IV.");
                }

                byte[] iv = new byte[ivLength];
                Array.Copy(fullCipher, iv, ivLength);

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, iv);

                using (MemoryStream msDecrypt = new MemoryStream(fullCipher, ivLength, fullCipher.Length - ivLength))
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                {
                    return srDecrypt.ReadToEnd();
                }
            }
        }



    }
}
