import { Routes, Route } from 'react-router-dom';
import Home from './Home'; // Move your current layout into this
import LoginComponent from './admin_components/LoginComponent';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginComponent />} />
    </Routes>
  );
}

export default App;
