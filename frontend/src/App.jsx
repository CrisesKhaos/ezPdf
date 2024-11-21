import { useEffect, useState } from "react";
import { getTest } from "./services/test";
import "./App.css";
import SignUp from "./pages/SignUp/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import Dashboard from "./pages/Dashboard/Dashboard";
function App() {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = createBrowserRouter([
    { path: "/", element: <SignUp /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/dashboard", element: <Dashboard /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
