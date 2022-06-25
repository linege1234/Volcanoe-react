import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "reactstrap";
import { Map, Marker } from "pigeon-maps";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart, ArcElement } from "chart.js";

// css style varibles.
const p_style = {
  fontSize: "24px",
  margin: "20px",
};
const text_center = {
  textAlign: "center",
};
const info_container = {
  margin: "4px",
  width: "600px",
  height: "800px",
};
const pie_container = {
  borderStyle: "solid",
  height: "350px",
  margin: "auto",
  width: "50%",
  border: "3px solid black",
  padding: "10px",
};
const middle_container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "800px",
};

// chart register for the pie-chart.
Chart.register(ArcElement);

// pichart component.
function PieChart() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [population, setPopulation] = useState([]);
  let token = localStorage.getItem("token");
  // fetch the volcanoes/id endpoint using the volcanoes id.
  useEffect(() => {
    fetch("http://sefdb02.qut.edu.au:3001/volcano/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((pop) => setPopulation(pop));
  }, []);
  const pop_5km = population.population_5km;
  const pop_10km = population.population_10km;
  const pop_30km = population.population_30km;
  const pop_100km = population.population_100km;

  const data = {
    labels: ["5 km", "10 km", "30 km", "100 km"],
    datasets: [
      {
        label: "Population",
        borderColor: "white",
        borderWidth: 1,
        backgroundColor: ["#fd536d", "#ff8957", "#eed054", "#cbd84a"],
        data: [pop_5km, pop_10km, pop_30km, pop_100km],
      },
    ],
  };
  // options data of pie-chart.
  const options = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        backgroundColor: "black",
        borderRadius: 40,
        padding: 10,
        color: "white",
        textAlign: "center",
        formatter: (value, ctx) => {
          let index = ctx.dataIndex;
          let label = ctx.chart.data.labels[index];
          return label + "\n" + value + " people";
        },
      },
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14,
          },
          padding: 60,
          usePointStyle: true,
        },
      },
    },
  };
  // if customers log in, it will render the pie-chart; otherwise, intruction about more details will come up.
  if (token) {
    return (
      <div className="chart4Container" style={text_center}>
        Population chart
        <div style={pie_container}>
          <Pie data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center", margin: "14px" }}>
        If you login, you can check more information about the population data
        and map
      </div>
    );
  }
}
// mapping component
const Mapping = (props) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [location, setLocation] = useState([]);
  let token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://sefdb02.qut.edu.au:3001/volcano/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((loc) => setLocation(loc));
  }, []);
  const name = location.name;
  const lat = parseFloat(location.latitude);
  const long = parseFloat(location.longitude);
  const [zoom, setZoom] = useState(11);
  const [center, setCenter] = useState([lat, long]);
  // if I used just parsed lattitude and longtitude, the map is not loaded because useEffect will create firstly. So, need to use If statement in case of NaN type.
  if (!isNaN(lat) && !isNaN(long)) {
    return (
      <div>
        {name} map
        <Map
          height={600}
          defaultCenter={[lat, long]}
          zoom={zoom}
          onBoundsChanged={({ zoom }) => {
            setZoom(zoom);
            setCenter(center);
          }}
        >
          <Marker anchor={[lat, long]} />
        </Map>
        <p style={p_style}>Latitude:{lat}</p>
        <p style={p_style}>Longtitude:{long}</p>
      </div>
    );
  }
};

export default function Individual() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://sefdb02.qut.edu.au:3001/volcano/" + id)
      .then((res) => res.json())
      .then((volcanos) => setData(volcanos));
  }, []);

  const country = data.country;
  const region = data.region;
  const subregion = data.subregion;
  const last_eruption = data.last_eruption;
  const summit = data.summit;
  const elevation = data.elevation;
  const name = data.name;

  return (
    <div className="details">
      <h1 style={text_center}>{name} information</h1>
      <p style={text_center}>The volcano that you selected was: {name}</p>
      <div className="middle_container" style={middle_container}>
        <div className="left" style={info_container}>
          <h1 style={{ margin: "2px" }}>{name}</h1>
          <p style={p_style}>Country : {country}</p>
          <p style={p_style}>Region : {region}</p>
          <p style={p_style}>Subregion : {subregion}</p>
          <p style={p_style}>Last Eruption : {last_eruption}</p>
          <p style={p_style}>Summit : {summit}</p>
          <p style={p_style}>Elevation : {elevation}</p>
        </div>
        <div className="right" style={info_container}>
          <Mapping />
        </div>
      </div>
      <div style={text_center}>
        <Button
          color="dark"
          size="sm"
          className="mt-3"
          onClick={() => navigate("/Volcanos")}
          display="inlineBlock"
        >
          Back
        </Button>
      </div>
      <div className="chart" style={{ height: "1200px" }}>
        <PieChart radius="90" />
      </div>
    </div>
  );
}
