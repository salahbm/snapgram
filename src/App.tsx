import { Route, Routes } from "react-router-dom";
import "./globals.css";
import SignInForm from "../src/_auth/forms/SignInForm";
import SignUpForm from "../src/_auth/forms/SignUpForm";
import AuthLayout from "../src/_auth/AuthLayout";
import { Home } from "../src/_root/pages/index";
import RootLayout from "../src/_root/RootLayout";
import { Toaster } from "./components/ui/toaster";
const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
