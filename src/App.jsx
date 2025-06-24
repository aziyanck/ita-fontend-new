import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Move your current layout into this
import LoginComponent from './admin_components/LoginComponent';
import Admin from './Admin'



function App() {


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
