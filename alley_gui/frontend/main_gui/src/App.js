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
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import Feed from "./components/Feed";
import AnalyzeTrends from "./components/AnalyzeTrends";
import Inventory from "./components/Inventory";
import Ingredients from "./components/Ingredients";
import MenuItems from "./components/MenuItems";
import SupplyReorder from "./components/SupplyReorders";

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
        <Route path="/AnalyzeTrends" element={<AnalyzeTrends />} />
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/Ingredients" element={<Ingredients />} />
        <Route path="/MenuItems" element={<MenuItems />} />
        <Route path="/SupplyReorder" element={<SupplyReorder />} />

        <Route path="/menu" element={<MenuView />} />
        <Route path="/cashier" element={<CashierView />} />
        <Route path="/manager" element={<ManagerView />} />
        <Route path="/customer" element={<CustomerView />} />
      </Routes>
    </div>
  );
}

export default App;
