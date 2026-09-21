import { Outlet, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AppProvider } from "./context/AppContext";
import App from "./App";
import FlyRadar from "./pages/FlyRadar"; 
import NotFound from "./pages/NotFound";
import FlightDetails from "./pages/FlightDetails";
import About from "./pages/About";

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default function RoutesFile() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/flyradar" element={<FlyRadar />} />
          <Route path="/flight/:icao" element={<FlightDetails />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProvider>
  );
}