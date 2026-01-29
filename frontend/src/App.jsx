import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import CreatePostForm from "./components/CreatePostForm/CreatePostForm";
import Login from "./components/Login.jsx";
import Footer from "./components/Footer.jsx";



function App() {
  return (
    <BrowserRouter>
      <CreatePostForm />
      <Header />
      <Routes> 
        <Route path="/login" element={<Login />} />
      </Routes>


      <Footer/>


      
    </BrowserRouter>
  );
}

export default App;
