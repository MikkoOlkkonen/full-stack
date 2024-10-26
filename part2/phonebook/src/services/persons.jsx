import axios from 'axios'

const baseurl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseurl)
    return request.then(response => response.data)
}

const create = (nameObject) => {
    const request = axios.post(baseurl, nameObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseurl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, newPerson) => {
    const request = axios.put(`${baseurl}/${id}`, newPerson)
    return request.then(response => response.data)
}

export default { getAll, create, remove, update }