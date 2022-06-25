import React from "react";
import Carousel from "react-bootstrap/Carousel";

// carousel css style variable.
const carousel_style = {
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  margin: "100px 0px",
  padding: "20px 0px",
  width: "500px",
  height: "500px",
  objectFit: "cover",
};

const Carousell = () => {
  return (
    <Carousel style={carousel_style}>
      <Carousel.Item interval={1000}>
        <img
          className="d-block w-100"
          src="1.jpg"
          alt="First slide"
          height="400"
        />
        <Carousel.Caption>
          <h3>Volcanylist</h3>
          <p>You can check volcanos all around the world</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img
          className="d-block w-100"
          src="2.jpg"
          alt="Second slide"
          height="400"
        />
        <Carousel.Caption>
          <p>Just select your interested country!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="3.jpg"
          alt="Third slide"
          height="400"
        />
        <Carousel.Caption>
          <p>If you login, you can get more details like their population</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Carousell;
