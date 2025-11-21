import Navbar from "./component/Navbar"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Outlet  />
      </div>
    </div>
  )
}

export default MainLayout
