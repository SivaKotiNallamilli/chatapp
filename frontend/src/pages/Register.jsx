import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";


function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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

      await API.post(
        "/auth/register",
        formData
      );

      alert("Registration Successful");

      navigate("/");

    } catch (error) {

      alert(
        error.response.data.message
      );

    }

  };


  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to right, #667eea, #764ba2)",
      }}
    >

      <div
        style={{
          width: "380px",
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          boxShadow:
            "0px 5px 20px rgba(0,0,0,0.2)",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Register
        </h1>


        <form onSubmit={handleSubmit}>


          {/* USERNAME */}

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
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter Username"
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


          {/* EMAIL */}

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


          {/* PASSWORD */}

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


          {/* BUTTON */}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#667eea",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            Register
          </button>

        </form>


        {/* LOGIN LINK */}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#555",
          }}
        >
          Already User?{" "}

          <Link
            to="/"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;