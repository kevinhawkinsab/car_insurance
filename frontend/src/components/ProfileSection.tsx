import { TokenModel } from '../models/tokenModel';
import { Avatar, IconButton, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../environment/environment';
import { useNavigate, Link } from 'react-router-dom';

interface ProfileProps {
    token: string | null,
    decodedToken: TokenModel | null;
}


const ProfileSection = ({decodedToken, token}: ProfileProps) => {

  const navigate = useNavigate();
  const profileName = (name: string | undefined) => {
    if (name) {
      const words = name.trim().split(/\s+/);

      if (words.length < 2) {
        return name.split('')[0];
      }

      const initials = words[0][0] + words[1][0];
      return initials.toUpperCase();
    }
    return '';
  }

  const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      if (response.data.message === 'Ok') {
        localStorage.removeItem('token');
        navigate('/auth/login');
      }
    } catch (err: any) {
      console.log(err.response.data);
    }
  }

  return (
    <div className="flex gap-1">
        <Link to="/history" className="flex mx-1">
            <Avatar sx={{ bgcolor: '#1e88e5' }}>{profileName(decodedToken?.unique_name)}</Avatar>
            <div className="flex flex-col">
                <Typography component="p" color="black" fontWeight={600}>
                    {decodedToken?.unique_name}
                </Typography>
                <Typography component="p" lineHeight={0} color="text.secondary">
                    {decodedToken?.role === '2' ? 'Cliente' : 'Administrador'}
                </Typography>
            </div>
        </Link>
        <IconButton color='primary' aria-label="logout" onClick={logout}>
            <Logout />
        </IconButton>
    </div>
  )
}

export default ProfileSection
