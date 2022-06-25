import React from "react";
// css style varible.
const join_wrapper = {
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
const h1_style = {
  fontSize: "25px",
  paddingBottom: "20px",
  textAlign: "center",
};
const input_style = {
  padding: "5px",
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
  marginTop: "18px",
};
// join component
const join = () => {
  function join() {
    const url = "http://sefdb02.qut.edu.au:3001/user/register";
    const id = document.querySelector("#id"),
      psword = document.querySelector("#psword");
    const req = {
      email: id.value,
      password: psword.value,
    };
    console.log(req);
    // fetch the join endpoint using post method and customers' information
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
        alert(res.message);
        window.location.href = "/";
      });
  }

  return (
    <div style={join_wrapper} id="join_wrapper">
      <div
        style={{
          backgroundColor: "white",
          padding: "5px",
          width: "540px",
          height: "380px",
        }}
      >
        <h1 style={h1_style}>Join our Homepage</h1>
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <div
            className="label_input"
            style={{ display: "flex", textAlign: "center", marginLeft: "90px" }}
          >
            <div
              className="label"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={label_style}> ID </label>
              <label style={label_style}> Password </label>
              <label style={label_style}> Nickname </label>
              <label style={label_style}> Birth </label>
              <label style={label_style}> Address </label>
            </div>
            <div
              className="input"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "70px",
              }}
            >
              <input
                style={input_style}
                type={"text"}
                id="id"
                maxLength={"20"}
                placeholder="username"
                required
              />
              <input
                style={input_style}
                type={"password"}
                id="psword"
                maxLength={"20"}
                placeholder="password"
                required
              />
              <input
                style={input_style}
                type={"text"}
                id="Nickname"
                maxLength={"20"}
                placeholder="Nickname"
                required
              />
              <input
                style={input_style}
                type={"date"}
                id="Birth"
                maxLength={"20"}
                placeholder="Birth"
                required
              />
              <input
                style={input_style}
                type={"text"}
                id="Address"
                maxLength={"20"}
                placeholder="Address"
                required
              />
            </div>
          </div>
          <button
            style={button_style}
            type="submit"
            id="btn_login"
            onClick={join}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default join;
