import Navbar from "./component/Navbar"
import { Outlet } from "react-router-dom"
import BgMain from "./assets/bgMain.png"
import Footer from "./component/Footer"

function MainLayout() {
  return (
    <div 
    className="bg-cover bg-center bg-fixed min-h-screen space-y-10"
    style={{ backgroundImage: `url(${BgMain})` }}>
      <Navbar />
      <div className="p-4">
        <Outlet  />
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayout
