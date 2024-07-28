namespace backend.Models
{
    public interface ITokenBlacklistService
    {
        void AddTokenToBlackList(string token);
        bool IsTokenBlacklisted(string token);
    }
    public class TokenBlackListService : ITokenBlacklistService
    {
        private readonly HashSet<string> _blacklistedTokens = new HashSet<string>();

        public void AddTokenToBlackList(string token)
        {
            _blacklistedTokens.Add(token);
        }

        public bool IsTokenBlacklisted(string token)
        {
            return _blacklistedTokens.Contains(token);
        }
    }
}
