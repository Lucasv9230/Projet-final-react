import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import App from "./App";
import FlyRadar from "./pages/FlyRadar"; 
import NotFound from "./pages/NotFound";

export default function RoutesFile() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/flyradar" element={<FlyRadar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}