import React from "react";
import { Container } from "../component/Styles/Container/Container";
import { Header, MainHeader } from "../component/Styles/Header/Header.styled";
import Carousell from "../component/body/Carousell";

const homepage = () => {
  return (
    <Container>
      <Header>
        <MainHeader>
          <Carousell />
        </MainHeader>
      </Header>
    </Container>
  );
};

export default homepage;
