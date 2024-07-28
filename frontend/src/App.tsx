import './App.css';
import { RouterProvider } from 'react-router-dom';
import appRoutes from './routes';
import backImage from '../src/assets/download.svg';

function App() {

  return (
    <div style={{
      height: '100vh',
      backgroundImage: `url(${backImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat' 
    }}>
      <RouterProvider router={appRoutes} />
    </div>
  )
}

export default App;
