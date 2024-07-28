using AutoMapper;
using backend.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models.Dto;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly AppDbContext dbContext;

        public UserController(AppDbContext _dbContext, IMapper mapper)
        {
            dbContext = _dbContext;
            this.mapper = mapper; 
        }


        [HttpGet]  
        public async Task<IActionResult> ObtenerUsuarios()
        {
            var usuarios = await dbContext.Users.ToListAsync();
            var usuariosDto = mapper.Map<List<UserGetDto>>(usuarios);
            return Ok(usuariosDto);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> ObtenerUsuarioPorId(int id)
        {
            var usuario = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (usuario == null)
            {
                return NotFound(new { message = "El usuario especificado no existe" });
            }

            var usuarioDto = mapper.Map<UserGetDto>(usuario);
            return Ok(usuarioDto);
        }

        [HttpPost]
        public async Task<IActionResult> NuevoUsuario([FromBody] UserPostDto userPostDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await dbContext.Users.AnyAsync(u => u.Email == userPostDto.Email))
            {
                return BadRequest(new { message = "Ya existe un usuario con el mismo correo electrónico." });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userPostDto.Password);

            var usuario = new User
            {
                Name = userPostDto.Name,
                Email = userPostDto.Email,
                Password = hashedPassword,
                RoleId = 2
            };

            dbContext.Users.Add(usuario);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Usuario creado con éxito!." });

        }
    }
}
