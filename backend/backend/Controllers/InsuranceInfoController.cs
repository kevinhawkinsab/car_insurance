using AutoMapper;
using backend.Context;
using backend.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InsuranceInfoController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly AppDbContext dbContext;

        public InsuranceInfoController(AppDbContext _dbContext, IMapper mapper)
        {
            dbContext = _dbContext;
            this.mapper = mapper;
        }

        [HttpGet("Insurances")]
        public async Task<IActionResult> ObtenerSeguros()
        {
            var insurances = await dbContext.Insurances.ToListAsync();
            var insurancesDto = mapper.Map<List<InsuranceGetDto>>(insurances);
            return Ok(insurancesDto);
        }

        [HttpGet("Coverages")]
        public async Task<IActionResult> ObtenerCoverturas()
        {
            var coverages = await dbContext.Coverages.ToListAsync();
            var coveragesDto = mapper.Map<List<CoverageGetDto>>(coverages);
            return Ok(coveragesDto);
        }
    }
}
