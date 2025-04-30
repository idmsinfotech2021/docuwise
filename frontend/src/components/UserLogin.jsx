import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from '../axiosConfig';

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password
      });

      const { token, role, tenantId } = response.data;

      localStorage.setItem("docuwise_token", token);
      localStorage.setItem("docuwise_role", role);
      localStorage.setItem("docuwise_tenantId", tenantId);

      toast.success("Login successful!");

      if (role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#f9f9f9" }}>
      <Toaster />
      <div className="card p-5 shadow-sm" style={{ width: "400px" }}>
        <h3 className="mb-4 text-center">Login</h3>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
