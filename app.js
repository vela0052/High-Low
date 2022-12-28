function Wins ({wins}) {
  return (
    <h2 className="text-center">
      {wins}<br />
      Wins
    </h2>
  )
}

function Loses ({loses}) {
  return (
    <h2 className="text-center">
      {loses}<br />
      Loses
    </h2>
  )
}

function PlayButton (props) {
  function clickHandler () {
    props.onPlayGame()
  }
  return (<button className="btn btn-primary" onClick={clickHandler}>Play</button>)
}

function Response ({message}) {
  return (<div className="alert alert-info">{message}</div>)
}

function GuessForm (props) {
  const [guess, setGuess] = React.useState(props.guess || '')

  function changeHandler (e) {
    setGuess(e.target.value)
  }

  function submitHandler (e) {
    e.preventDefault()
    props.onGuess(parseInt(guess))
  }

  return (
    <form onSubmit={submitHandler}>
      <input  type="number"
              className="form-control mb-3" 
              min="1" 
              max="10"
              value={guess}
              onChange={changeHandler} />
      <button type="submit" className="btn btn-primary">Guess</button>
    </form>
  )
}

function App () {
  const min = 1
  const max = 10
  const maxGuesses = 3

  const [active, setActive] = useLocalStorage('active', false)
  const [number, setNumber] = useLocalStorage('number', 0)
  const [guesses, setGuesses] = useLocalStorage('guesses', 0)
  const [wins, setWins] = useLocalStorage('wins', 0)
  const [loses, setLoses] = useLocalStorage('loses', 0)
  const [guess, setGuess] = useLocalStorage('guess', '')
  const [message, setMessage] = useLocalStorage('message', '')

  function useLocalStorage (key, initialState) {
    const game = JSON.parse(localStorage.getItem('game'))
    return React.useState(game ? game[key] : initialState)
  }

  function playGame () {
    setActive(true)
    setMessage(`Guess a number between ${min} and ${max}.`)
    setGuesses(0)
    setNumber(Math.floor(Math.random() * max) + min)
  }

  function onGuessHandler (guess) {
    setGuess(guess)
    setGuesses((prevState) => prevState += 1)
  }

  function verifyGuess () {
    if (number === guess) {
      setWins((prevState) => prevState += 1)
      setMessage('You guessed the number!')
      endGame()
    } else {   
      if (guesses < maxGuesses) {
        if (guess < number) {
          setMessage(`Your guess was too low. Guesses remaining: ${maxGuesses - guesses}.`)
        } else {
          setMessage(`Your guess was too high. Guesses remaining: ${maxGuesses - guesses}.`)
        }
      } else {
        setMessage(`Sorry you are out of guesses. The number was ${number}.`)
        setLoses((prevState) => prevState += 1)
        endGame()
      }
    }
  }

  function endGame () {
    setGuess('')
    setNumber(0)
    setTimeout(() => setActive(false), 3000)
  }

  React.useEffect(() => {
    verifyGuess()
  }, [guess])

  React.useEffect(() => {
    localStorage.setItem('game', JSON.stringify({
      active,
      number,
      guesses,
      wins,
      loses,
      guess,
      message
    }))
  })

  return (
    <React.Fragment>
      <div className="row mb-5">
        <div className="col col-12">
          <h1 className="display-4 mb-5 text-center my-3">
            High Low
          </h1>
        </div>
        <div className="col col-6">
          <Wins wins={wins} />
        </div>
        <div className="col col-6">
          <Loses loses={loses} />
        </div>
      </div>
      <div className="row d-grid">
        {
          !active && 
            (<div className="col col-6 offset-3 text-center grid-column-1 grid-row-1"> 
              <PlayButton onPlayGame={playGame} />     
            </div>)
        }
        {
          active &&
            (<div className="col col-6 offset-3 grid-column-1 grid-row-1">
              <Response message={message} />
              <GuessForm guess={guess} onGuess={onGuessHandler} />
            </div>)
        }
        
      </div>   
    </React.Fragment>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)