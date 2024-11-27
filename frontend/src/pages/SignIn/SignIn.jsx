import React, { useEffect, useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const checkLogin = async () => {
    const x = await supabase.auth.getUser();
    if (x.error === null) {
      navigate("/dashboard");
    } else {
      await supabase.auth.signOut();
    }
  };

  const signInHandler = async () => {
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(response);
    if (response.error === null) {
      navigate("/dashboard");
    } else {
      alert(response.error.message);
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);
  const navigate = useNavigate();

  const SignOut = async () => {};

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="title">ezPdf</div>
        <div className="subtitle">Study Smarter, PDF Simplified</div>
      </div>
      <div className="signin-right">
        <div className="signin-title">Welcome Back</div>
        <div className="signin-card">
          <div class="coolinput">
            <label class="text" for="input">
              Email
            </label>
            <input
              class="input"
              name="input"
              placeholder="xyz@gmail.com"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div class="coolinput">
            <label class="text" for="input">
              Password
            </label>
            <input
              class="input"
              name="input"
              placeholder="********"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="signin-btn" onClick={signInHandler}>
            Sign In
          </div>
          <div>
            Don't have an account?{" "}
            <a href="/" className="anchor">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
