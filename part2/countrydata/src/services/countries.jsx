import axios from 'axios'

const baseurl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
    const request = axios.get(`${baseurl}/api/all`)
    return request.then(response => response.data)
}

const getWeather = (lat, long) => {
    const API_key = process.env.REACT_APP_WEATHERORG_API
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_key}`)
    return request.then(response => response.data)
}

const getIcon = (icon) => {
    const request = axios.get(`https://openweathermap.org/img/wn/${icon}@2x.png`)
    return request.then(response => response.data)
}

export default { getAll, getWeather, getIcon }