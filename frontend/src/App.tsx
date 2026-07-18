import { UserProvider,useUser } from "./context/userContext";
import UserSelector from "./components/UserSelector";
import Dashboard from "./pages/Dashboard";
const Renderlogic = () => {
const { currentUser } = useUser()

  return currentUser ? <Dashboard/>: <UserSelector/>;
};
function App() {

  return (
    <UserProvider>
    <Renderlogic/>
    </UserProvider>
  )
}

export default App