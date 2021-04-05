import './App.css';
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData } from "./Utils/Sort";
import { prettyPrint } from "./Utils/PrettyPrint";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core"
import { useEffect, useState } from 'react';
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    document.title = "Covid 19 Live Tracker"
 }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          let countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))

          let sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        })
    }

    getCountriesData();
  }, [])

  const onChangeCountry = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">

          <h1>Covid 19 Live Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onChangeCountry}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

        </div>

        <div className="app__stats">
          <InfoBox
            active={casesType === "cases"}
            isRed
            onClick={e => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrint(countryInfo.todayCases)}
            total={prettyPrint(countryInfo.cases)} />

          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType("recovered")}
            title="Recoveries"
            cases={prettyPrint(countryInfo.todayRecovered)}
            total={prettyPrint(countryInfo.recovered)} />

          <InfoBox
            active={casesType === "deaths"}
            isRed
            onClick={e => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrint(countryInfo.todayDeaths)}
            total={prettyPrint(countryInfo.deaths)} />
        </div>

        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
