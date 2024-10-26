import { useState, useEffect } from 'react'
import countryService from './services/countries.jsx'

const FindForm = ({ setFilter, filter }) => {
    const handleFind = (event) => {
        setFilter(event.target.value)
    }
    return (
        <form>
            find countries <input value={filter} onChange={handleFind} />
        </form>
    )
}

const Weather = ({ country, weather }) => {
    if (!weather) return null
    const icon = weather.weather[0].icon
    console.log(icon);
    
    return (
        <div>
            <h2>Weather in {country.capital}</h2>
            <p>temperature {(weather.main.temp - 273.15).toFixed(1)} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt='Weather icon' />
            <p>wind {weather.wind.speed} m/s</p>
        </div>
    )
}

const Details = ({ country, weather }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>capital {country.capital}</div>
            <div>area {country.area}</div>
            <h2>languages</h2>
            <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt}/>
            <Weather key={country} country={country} weather={weather} />
        </div>
    )
}

const DetailButton = ({ toggleShow }) => {
    return <button onClick={toggleShow}>show</button>
}

const Country = ({ len, country }) => {
    const [show, setShow] = useState(false)
    const [weather, setWeather] = useState(null)
    //const [icon, setIcon] = useState(null)

    useEffect(() => {
        if (country.capital) {
            if (country.capitalInfo) {
                if (country.capitalInfo.latlng) {
                    countryService.getWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
                    .then(weath => {
                        setWeather(weath)
                    })
                }
            }
        }
    }, [show, country])
    /*
    useEffect(() => {
        if (weather && weather.weather[0] && weather.weather[0].icon) {
            console.log(weather.weather[0].icon)
    
            countryService.getIcon(weather.weather[0].icon)
            .then(icon => {
                console.log(icon)
                setIcon(icon)
            })
        }
    }, [show, country])
    */

    const toggleShow = () => {
        setShow(!show)
    }

    if (len === 1 || show) {
        return (
            <div>
                <Details key={country} country={country} weather={weather} />
            </div>
            
        )
    }
    else {
        return (
            <div>
                <span>{country.name.common} </span>
                <DetailButton key={country} toggleShow={toggleShow} />
            </div>
        )
    }
}

const Countries = ({ countries, filter }) => {
    if (filter !== '') {
        const filtered = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()) || country.name.official.toLowerCase().includes(filter.toLowerCase()))
        if (filtered.length > 10) {
            return (
                <div>
                    Too many countries, specify another filter
                </div>
            )        
        }
        else if (filtered.length > 0) {
            return (
                <div>
                    {filtered.map(country => <Country key={country.name.official} len={filtered.length} country={country}/>)}
                </div>
            )
        }
    }
}

const App = () => {
    const [countries, setCountries] = useState([])
    const [filter, setFilter] = useState('')

    useEffect(() => {
        countryService.getAll().then(initialCountries => {
            setCountries(initialCountries)
        })
    }, [])

    return (
        <div>
            <FindForm setFilter={setFilter} filter={filter}  />
            <Countries countries={countries} filter={filter} />
        </div>
    )
}

export default App