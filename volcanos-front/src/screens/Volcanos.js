import { Container } from "../component/Styles/Container/Container";
import { Header, MainHeader } from "../component/Styles/Header/Header.styled";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
// css style varibles.
const main_header_style = {
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  margin: "100px 0px",
  padding: "20px 0px",
  height: "600px",
  width: "800px",
  objectFit: "cover",
};
const h1_style = {
  color: "White",
  padding: "20px",
};
const select_style = {
  margin: "3px",
};
const option_style = {
  display: "flex",
  margin: "3px",
  alignItems: "center",
  width: "50%",
};
const table_style = {
  height: "505px",
  width: "800px",
};
const general_font_style = {
  margin: "12px",
  fontSize: "1em",
};
const Table = (props) => {
  // left option for country select.
  const [optionl, setOptionl] = useState([]);
  // fetch the countries endpoint.
  useEffect(() => {
    const optionl = [];
    fetch("http://sefdb02.qut.edu.au:3001/countries")
      .then((res) => res.json())
      .then((data) => {
        for (var i in data) {
          optionl[i] = {
            value: data[i],
            label: data[i],
          };
        }
        setOptionl(optionl);
      });
  }, []);

  // the value which user selected.
  const [LvalueState, LsetValueState] = useState("algeria");
  const handlerR = (event) => {
    const value = event.value;
    LsetValueState(value);
  };

  // right option for population select.

  const optionr = [
    { value: "5km", label: "5 Km" },
    { value: "10km", label: "10 Km" },
    { value: "30km", label: "30 Km" },
    { value: "100km", label: "100 Km" },
  ];
  let [RvalueState, RsetValueState] = useState("5km");

  let handlerL = (event) => {
    const value = event.value;
    RsetValueState(value);
  };
  // if user select None selection for the population, it's going to be null.

  const navigate = useNavigate();
  const [rowData, setRowData] = useState(["5km"]);
  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Region", field: "region", sortable: true, filter: true },
    {
      headerName: "Subregion",
      field: "subregion",
      sortable: true,
      filter: true,
    },
    { headerName: "Country", field: "country", sortable: true, filter: true },
    { headerName: "ID", field: "id", sortable: true, filter: true },
  ];

  const url =
    "http://sefdb02.qut.edu.au:3001/volcanoes?country=" +
    LvalueState +
    "&populatedWithin=" +
    RvalueState;
  // fetch the volcanoes endpoint using country query.
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((works) =>
        works.map((volcano) => {
          return {
            name: volcano.name,
            region: volcano.region,
            subregion: volcano.subregion,
            country: volcano.country,
            id: volcano.id,
          };
        })
      )
      .then((volcanos) => setRowData(volcanos));
  }, [LvalueState, RvalueState]);

  return (
    <div>
      <div
        className="all-option"
        style={{ display: "flex", margin: "12px", alignItems: "center" }}
      >
        <div className="left_option" style={option_style}>
          <div className="country-txt" style={general_font_style}>
            Country :
          </div>
          <Select
            options={optionl}
            onChange={handlerR}
            style={select_style}
            defaultValue={{ label: "Algeria", value: "Algeria" }}
          />
        </div>
        <div className="right_option" style={option_style}>
          <div className="population" style={general_font_style}>
            Populated with :
          </div>
          <Select
            options={optionr}
            onChange={handlerL}
            style={select_style}
            defaultValue={{ label: "5km", value: "5km" }}
          />
        </div>
      </div>

      <div className="container">
        <div className="ag-theme-balham" style={table_style}>
          <AgGridReact
            columnDefs={columns}
            rowData={rowData}
            pagination
            paginationPageSize={15}
            onRowClicked={(row) =>
              navigate(
                `/individual?id=${row.data.id}&country=${row.data.country}`
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

const volcanos = () => {
  return (
    <Container>
      <Header>
        <MainHeader>
          <div className="ag-theme-balham" style={main_header_style}>
            <h1 style={h1_style}>Volcanoes' list</h1>
            <Table />
          </div>
        </MainHeader>
      </Header>
    </Container>
  );
};

export default volcanos;
