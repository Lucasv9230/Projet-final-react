import { Routes, Route } from "react-router-dom";
import App from "./App";            
import NotFound from "./pages/NotFound";

export default function RoutesFile() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<App />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
