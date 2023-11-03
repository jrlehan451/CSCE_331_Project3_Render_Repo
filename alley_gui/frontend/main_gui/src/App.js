import "./App.css";
import Header from "./components/Header";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import MenuView from "./pages/MenuView";
import CashierView from "./pages/CashierView";
import ManagerView from "./pages/ManagerView";
import CustomerView from "./pages/CustomerView";
import Home from "./pages/Home";

//BrowserRouter basename="/tutorial"> for
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  return (
    <div className="App">
      {isHomePage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<MenuView />} />
        <Route path="/cashier" element={<CashierView />} />
        <Route path="/manager" element={<ManagerView />} />
        <Route path="/customer" element={<CustomerView />} />
      </Routes>
    </div>
  );
}

export default App;
