const Header = ({ name }) => <h1>{name}</h1>

const Total = ({ sum }) => <p><strong>total of {sum} exercises</strong></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return (parts.map(part =>
      <Part key={part.id} part={part} />
    )
  )
}
  
const Course = ({ course }) =>{
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total sum={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
    </div>
  )
}

export default Course