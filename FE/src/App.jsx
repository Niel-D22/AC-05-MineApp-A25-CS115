import { BrowserRouter, Routes, Route } from "react-router-dom";
import Beranda from "./pages/Beranda";
import Rekomendasi from "./pages/Rekomendasi";
import Tanyakan from "./pages/Tanyakan";
import Layout from "./Layout";
import AnimasiMasuk from "./pages/Auth/AnimasiMasuk";
import Auth from "./pages/Auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnimasiMasuk />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/home" element={<Layout />}>
          <Route index element={<Beranda />} />
          <Route path="rekomendasi" element={<Rekomendasi />} />
          <Route path="tanyakan" element={<Tanyakan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
