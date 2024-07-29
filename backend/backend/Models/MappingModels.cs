using AutoMapper;
using backend.Models.Dto;

namespace backend.Models
{
    public class MappingModels: Profile
    {
        public MappingModels() {
            CreateMap<User, UserGetDto>();
            CreateMap<Quote, QuoteGetDto>();
            CreateMap<Insurance, InsuranceGetDto>();
            CreateMap<Coverage, CoverageGetDto>();
        }
    }
}