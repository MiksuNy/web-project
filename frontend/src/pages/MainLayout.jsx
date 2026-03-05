import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MobilePanel from "../components/MobilePanel";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <MobilePanel />
      <Footer />
    </>
  )
}
