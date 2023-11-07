import { Route, Routes } from "react-router-dom";
import "./globals.css";
import SignInForm from "../src/_auth/forms/SignInForm";
import Home from "../src/_root/pages/Home";
const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route path="/sign-in" element={<SignInForm />} />
        {/* private routes */}
        <Route index element={<Home />} />
      </Routes>
    </main>
  );
};

export default App;
