import { BrowserRouter, Routes, Route } from "react-router-dom";
import Beranda from "./pages/Beranda";
import Rekomendasi from "./pages/Rekomendasi";
import Tanyakan from "./pages/Tanyakan";
import Layout from "./Layout";
import AnimasiMasuk from "./pages/Auth/AnimasiMasuk";
import Auth from "./pages/Auth/Auth";
import { AuthProvider } from "./context/AuthContext";
import Notifikasi from "./pages/Notifikasi";
import Profile from "./pages/Profil";
import SummaryPlan from "./component/Rekomendasi/SummaryPlan";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AnimasiMasuk />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/home" element={<Layout />}>
            <Route index element={<Beranda />} />
            <Route path="rekomendasi" element={<Rekomendasi />} />
            <Route path="tanyakan" element={<Tanyakan />} />
            <Route path="notifikasi" element={<Notifikasi />} />
            <Route path="profile" element={<Profile />} />
            <Route path="summary-plan" element={<SummaryPlan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
