import HomeScreen from "./screens/home"
import LandingScreen from "./screens/landing"
import './index.css'
import { useAuth } from "./hooks/useAuth"

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn ? <HomeScreen/> : <LandingScreen/>}
    </>
  )
}

export default App
