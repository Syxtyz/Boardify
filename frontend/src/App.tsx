import HomeScreen from "./screens/home"
import LandingScreen from "./screens/landing"
import './styles/index.css'
import { useAuth } from "./lib/hooks/useAuth"
import Toast from "./components/ui/toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PublicBoardScreen from "./screens/public";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/:public_id" element={<PublicBoardScreen />} />
        {isLoggedIn ? (
          <Route path="/*" element={<HomeScreen/>}/>
        ) : (
          <Route path="/*" element={<LandingScreen/>}/>
        )}
      </Routes>
      <Toast />
    </Router>
  )
}

export default App
