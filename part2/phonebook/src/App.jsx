import { useState, useEffect } from 'react'
import nameService from './services/persons.jsx'

const RemoveButton = ({ id, setPersons, persons, name, setNotification }) => {
    const handleRemove = () => {
        if (window.confirm(`Delete ${name} ?`)) {
            nameService.remove(id).then(() => {
                setPersons(persons.filter(person => person.id !== id))
            })
            .catch(error => {
                setNotification(`Information of ${name} has already been removed from server`)
                setPersons(persons.filter(person => person.id !== id))
                setTimeout(() => {
                    setNotification(null)
                }, 2000)
            })
        }
    }
    return (
            <button onClick={handleRemove}>delete</button>
    )
}

const Person = ({ number, setPersons, persons, setNotification }) => {

    return (
        <div>
            <span>{name} {number.number} </span>
            <RemoveButton id={number.id} setPersons={setPersons} persons={persons} name={number.name} setNotification={setNotification} />
        </div>
        
    )
}

const Persons = ({ numbers, filter, setPersons, setNotification }) => {
    const filtered = numbers.filter(number => number.name.toLowerCase().includes(filter.toLowerCase()))
    return (
        <div>
            {filtered.map(number => <Person key={number.id} number={number} setPersons={setPersons} persons={numbers} setNotification={setNotification} />)}
        </div>
    )
}

const Filter = ({ filterby, setFilterby }) => {
    const handleFilter = (event) => {
        setFilterby(event.target.value)
    }
    return (
        <form>
            <div>
                filter shown with <input value={filterby} onChange={handleFilter} />
            </div>
        </form>
    )
}

const PersonForm = ({ persons, setPersons, newName, setNewName, newNumber, setNewNumber, setNotification }) => {
    const addName = (event) => {
        event.preventDefault()
        if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
            if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
                const person = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
                const changedPerson = {...person, number: newNumber}
                nameService.update(changedPerson.id, changedPerson).then(returnedPerson => {
                    setPersons(persons.map(person => person.id === changedPerson.id ? returnedPerson : person))
                    setNotification(`Updated ${newName}`)
                    setNewName('')
                    setNewNumber('')
                    setTimeout(() => {
                        setNotification(null)
                    }, 2000)
                })
                .catch(error => {
                    setNotification(`Information of ${newName} has already been removed from server`)
                    setPersons(persons.filter(person => person.id !== changedPerson.id))
                    setTimeout(() => {
                        setNotification(null)
                    }, 2000)
                })
            }
        }
        else {
            const nameObject = {name: newName, number: newNumber}
            nameService.create(nameObject).then(newObject => {
                setPersons(persons.concat(newObject))
                setNotification(`Added ${newName}`)
                setNewName('')
                setNewNumber('')
                setTimeout(() => {
                    setNotification(null)
                }, 2000)
            })
        }
    }


    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }
    return (
        <form onSubmit={addName}>
            <div>
            name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
            number: <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
    )
}

const Notification = ({ message }) => {
    if (!message) {
        return null
    }
    let className = 'notif'
    if (message[0] === 'I') {
        className = 'error'
    }
    return (
        <div className={className}>
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterby, setFilterby] = useState('')
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        nameService.getAll().then(initialNames => {
            setPersons(initialNames)
        })
    }, [])

    return (
        <div>
        <h2><strong>Phonebook</strong></h2>
        <Notification message={notification} />
        <Filter filterby={filterby} setFilterby={setFilterby} />
        <h3><strong>add a new</strong></h3>
        <PersonForm persons={persons} setPersons={setPersons} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} setNotification={setNotification} />
        <h3><strong>Numbers</strong></h3>
        <Persons numbers={persons} filter={filterby} setPersons={setPersons} setNotification={setNotification} />
        </div>
    )
}

export default App