import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      localStorage.clear();

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("email", response.data.user.email);

      localStorage.setItem("username", response.data.user.username);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #4facfe, #00f2fe)",
      }}
    >
      <div
        style={{
          width: "350px",
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0px 5px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#4facfe",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#555",
          }}
        >
          New User?{" "}
          <Link
            to="/register"
            style={{
              color: "#4facfe",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
