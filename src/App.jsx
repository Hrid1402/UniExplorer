import { useEffect, useState } from 'react';
import './styles/App.css';
import Map from './Map.jsx';

function App() {
  const [country, setCountry] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [universitiesData, setUniversitiesData] = useState(null);
  const [countryImages, setCountryImages] = useState([]);
  const [countryDescription, setCountryDescription] = useState(null);

  function selectCountry(country){
    setCountry(country)
  }
  async function getCountryData(){
    const corsProxy = "https://corsproxy.io/?";
    const url = "https://countries.mdiwanshu.workers.dev/search?name=" + country;
    fetch(corsProxy + encodeURIComponent(url)).then(r => r.json()).then(r=>{
      let index = (country != "united states") ? 0 : 1;
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
      setUniversitiesData(r);
    }).catch(e=>console.log(e));
  }
  async function getCountryPhotos() {
    const url = "https://api.unsplash.com/search/photos?query= "+ country +"&per_page=3&client_id=" + import.meta.env.VITE_API_KEY;
    fetch(url).then(r => r.json()).then(r=>{
      let images = [];
      r.results.map(img => {
        images.push(img.urls.regular);
      });
      setCountryImages(images);

    }).catch(e=>console.log(e));
  }

  async function getCountryDescription() {
    const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + country;
    fetch(url).then(r => r.json()).then(r=>{
      setCountryDescription(r.extract);
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
    getCountryPhotos();
    getCountryDescription();
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
          
          <div className='languages'>
            <h2 className='languages'>Languages:</h2>
            {
                Object.entries(countryData.languages).map(([key, value]) =>(
                  <p className='language'  key={key}>{value}</p>
                ))
            }
          </div>  
          </>

          :
          null
        }
        <div className="images">
          {countryImages.map((imgURL, i) => {
                return <img src={imgURL} key={i}></img>
            })}
        </div>
      </div> : <div><h1>UniExplorer</h1><h3>Discover universities across the globe</h3></div>
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
      {
        countryDescription && countryData?
        <article>
          <h2>{countryData.name} Overview</h2>
          <p>{countryDescription}</p>
          
          </article> : null
      }
    </>
  )
}

export default App
