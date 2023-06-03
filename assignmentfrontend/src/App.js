import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter , Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationForm from './components/Registration';
import TransporterLandingPage from './components/TransporterLandingPage'
import ManufacturerLandingPage from './components/ManufacturerLandingPage'
function App() {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const storeTokenInCookie = (token) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  };

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        return cookie.substring('token='.length, cookie.length);
      }
    }
    return null;
  };

  const token = getTokenFromCookie();

  
  const getUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data);
      } else {
        throw new Error('Failed to get user');
      }
    } catch (error) {
      console.error('Error getting user:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const verify=()=>{
    setIsLoading(true);
    const token = getTokenFromCookie();
    if (token) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? ( user.role==="Transporter"?
                <TransporterLandingPage userType={user.role} token={token} />: <ManufacturerLandingPage userType={user.role} token={token}/>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<LoginPage storeTokenInCookie={storeTokenInCookie} verify={verify}/>} />
          <Route path="/register" element={<RegistrationForm storeTokenInCookie={storeTokenInCookie} verify={verify}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;