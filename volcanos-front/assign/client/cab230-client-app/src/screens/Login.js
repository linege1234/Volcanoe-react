import React from "react";
import { Link } from "react-router-dom";
// css style varibles.
const login_wrapper = {
  border: "20px",
  padding: "5px 20px",
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "600px",
  height: "450px",
  marginLeft: "-220px",
  marginTop: "-170px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "skyblue",
};
const label_style = {
  flex: "1",
  textAlign: "left",
  margin: "8px",
};
const button_style = {
  width: "85px",
  padding: "3px",
  margin: "1px",
  marginTop: "30px",
};
const h1_style = {
  fontSize: "25px",
  paddingBottom: "20px",
  textAlign: "center",
};
// login component
function Login() {
  function login() {
    const url = "http://sefdb02.qut.edu.au:3001/user/login";
    const id = document.querySelector("#id"),
      psword = document.querySelector("#psword");
    const req = {
      email: id.value,
      password: psword.value,
    };
    // fetch the login endpoint using post method and customers' information
    return fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.token) {
          alert("Succesful!");
          localStorage.setItem("token", res.token);
          window.location.href = "/";
        } else {
          alert(res.message);
        }
      });
  }
  return (
    <div style={login_wrapper} id="login_wrapper">
      <div
        style={{
          backgroundColor: "white",
          padding: "5px",
          width: "540px",
          height: "380px",
        }}
      >
        <h1 style={h1_style}>Welcome to Login</h1>
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <label style={label_style}> ID </label>
          <input
            style={{ padding: "5px", marginLeft: "50px" }}
            type={"text"}
            id="id"
            maxLength={"20"}
            placeholder="username"
            required
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <label style={label_style}> Password </label>
          <input
            style={{ padding: "5px" }}
            type={"password"}
            id="psword"
            maxLength={"20"}
            placeholder="password"
            required
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <Link to="/Join">
            <button style={button_style} type="submit" id="btn_login">
              Join
            </button>
          </Link>
          <button
            style={button_style}
            type="submit"
            className="button"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
export default Login;
