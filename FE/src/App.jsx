import { BrowserRouter, Routes, Route } from "react-router-dom";
import Beranda from "./pages/Beranda";
import Rekomendasi from "./pages/Rekomendasi";
import Tanyakan from "./pages/Tanyakan";
import Layout from "./Layout"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Beranda />} />
          <Route path="Rekomendasi" element={<Rekomendasi />} />
          <Route path="Tanyakan" element={<Tanyakan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
