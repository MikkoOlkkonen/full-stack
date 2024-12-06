import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { vote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  return(
    <div>
      {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
          dispatch(vote(anecdote.id))
        }} />
      )}
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired
  }).isRequired,
  handleClick: PropTypes.func.isRequired
}

export default AnecdoteList