import { useEffect, useState } from 'react'
import './styles/App.css'
import Map from './Map.jsx'

function App() {
  const [country, setCountry] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [universitiesData, setUniversitiesData] = useState(null);

  function selectCountry(country){
    setCountry(country)
  }
  async function getCountryData(){
    const corsProxy = "https://corsproxy.io/?";
    const url = "https://countries.mdiwanshu.workers.dev/search?name=" + country;
    fetch(corsProxy + encodeURIComponent(url)).then(r => r.json()).then(r=>{
      let index = (country != "united states") ? 0 : 1;
      console.log(r[index])
      setCountryData(
        {
          name: r[index].name.common,
          population: r[index].population,
          flag: r[index].flags[1],
          map: r[index].maps.googleMaps,
          currencies: r[index].currencies[Object.keys(r[0].currencies)[0]].name + " 1" +r[0].currencies[Object.keys(r[0].currencies)[0]].symbol,
          independent: r[index].independent,
          capital: r[index].capital,
          languages: r[index].languages
      });
    }).catch(e=>console.log(e));
  }
  async function getUniversitiesData() {
    const corsProxy = "https://corsproxy.io/?";
    const url = "http://universities.hipolabs.com/search?country=" + country;
    fetch(corsProxy + encodeURIComponent(url)).then(r => r.json()).then(r=>{
      console.log(r),
      setUniversitiesData(r);
    }).catch(e=>console.log(e));
  }

  useEffect(()=>{
    if(country==null){
      return;
    }
    console.log("selected: " + country);
    getCountryData();
    getUniversitiesData();
    window.scrollTo(0, 0);
  }, [country]);

  return (
    <>
      {
      countryData ?
        <div className="countryData">
        <h1>{countryData.name}</h1>     
        <a href={countryData.map}><img src={countryData.flag} alt="flag" height="150px"/></a>
        <h2>Population: {countryData.population}</h2>
        <h2>Capital: {countryData.capital}</h2>
        <h2>Currency: {countryData.currencies}</h2>
        <h2>{countryData.independent ? "Is an independent country." : "Is not an independent country."}</h2>
        {
          countryData.languages ? 
          <>
          <h2>Languages:</h2>
            {
                Object.entries(countryData.languages).map(([key, value]) =>(
                  <h2 key={key}>{value}</h2>
                ))
            }
          </>

          :
          null
        }
      </div> : null
      }
      
      <Map selectCountry={selectCountry}></Map>

      {
        (countryData && universitiesData && universitiesData.length>0) ?
          <>
            <h1>Universities in {countryData.name}</h1> 
            <h2>Amount: {universitiesData.length}</h2>
            <div className="container">
              
              <div className='uniList'>
              {
                universitiesData.map((uni,i)=>{
                  return <a href={uni.web_pages[0]} key={i} target="_blank">{uni.name}</a>  
                })
              }
              </div>
            </div>
          </>: null
      }
    </>
  )
}

export default App
