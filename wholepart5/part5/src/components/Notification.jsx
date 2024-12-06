const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  let classname = 'notif'
  if (message[0] === 'w' || message[0] === 'u') {
    classname = 'error'
  }

  return (
    <div className={classname}>
      {message}
    </div>
  )
}

export default Notification