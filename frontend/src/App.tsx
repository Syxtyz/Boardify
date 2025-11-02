import HomeScreen from "./screens/home"
import LandingScreen from "./screens/landing"
import './styles/index.css'
import { useAuth } from "./hooks/useAuth"
import Toast from "./components/ui/toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PublicBoardScreen from "./screens/public";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <Route path="/*" element={<HomeScreen/>}/>
        ) : (
          <Route path="/*" element={<LandingScreen/>}/>
        )}
        <Route path="/:public_id" element={<PublicBoardScreen />} />
      </Routes>
      <Toast />
    </Router>
  )
}

export default App
