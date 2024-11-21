import React, { useState, useEffect } from "react";
import "../../App";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confPass, setconfPass] = useState("");
  const navigate = useNavigate();

  const signUpHandler = async () => {
    if (password == confPass) {
      const response = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { name: name } },
      });
      if (response.error == null) {
        navigate("/dashboard");
      } else {
        alert(response.error.message);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  const signOutHandler = async () => {
    const response = await supabase.auth.signOut();
  };

  const checkLogin = async () => {
    const x = await supabase.auth.getUser();
    if (x.error === null) {
      console.log("User is logged in");
      navigate("/dashboard");
    } else {
      console.log("User is not logged in");
      await supabase.auth.signOut();
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div className="signin-container">
      <div className="signin-left"></div>
      <div className="signin-right">
        <div className="signin-title">Create an Account</div>
        <div className="signin-card">
          <div class="coolinput">
            <label class="text" for="input">
              Name
            </label>
            <input
              class="input"
              name="input"
              placeholder="John Doe"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              placeholder="*********"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div class="coolinput">
            <label class="text" for="input">
              Confirm Password
            </label>
            <input
              class="input"
              name="input"
              placeholder="*********"
              type="password"
              value={confPass}
              onChange={(e) => setconfPass(e.target.value)}
            />
          </div>
          <div className="signin-btn" onClick={signUpHandler}>
            Sign Up
          </div>
          <div>
            Already have an account?{" "}
            <a href="/signin" className="anchor">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
