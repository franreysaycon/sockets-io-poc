import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io("http://localhost:8000", { autoConnect: false });

function App() {
  const [username, setUsername] = useState(null)
  const [numbers, setNumbers] = useState([])
  const [strategies, setStrategies] = useState([1, 2, 3])
  const usernameRef = useRef()
  const loggedInRef = useRef(false)

  useEffect(() => {
    if (username && !loggedInRef.current) {
      socket.auth = { username }
      socket.connect()
      socket.on('connect', () => {
        socket.emit('strategies', strategies)
      })
      loggedInRef.current = true
    }
  }, [username, strategies])

  useEffect(() => {
    socket.on("new alerts", data => {
      console.log(data)
      setNumbers([...numbers, data])
    });
  }, [numbers, setNumbers])

  const submitUsername = () => {
    setUsername(usernameRef.current.value)
    socket.emit('login', username)
  }
  console.log(strategies)
  const toggleStrategy = (strat) => {
    let newStrategies = strategies

    if (!!strategies.find(st => st === strat)) {
      newStrategies = strategies.filter(st => st !== strat)
      setStrategies(newStrategies)
    }
    else {
      newStrategies = [...strategies, strat]
      setStrategies(newStrategies)
    }

    socket.emit('strategies', newStrategies)
  }

  return (
    <>
      {
        !username ? <div>
          <input type="text" ref={usernameRef} placeholder="who are you?" />
          <button onClick={submitUsername}>Submit</button>
        </div> :
          <div>
            <div style={{ display: "flex", flexDirection: 'column' }}>
              <span><input type="checkbox" checked={!!strategies.find(st => st === 1)} onChange={() => toggleStrategy(1)} />Strategy 1</span>
              <span><input type="checkbox" checked={!!strategies.find(st => st === 2)} onChange={() => toggleStrategy(2)} />Strategy 2</span>
              <span><input type="checkbox" checked={!!strategies.find(st => st === 3)} onChange={() => toggleStrategy(3)} />Strategy 3</span>
            </div>
            {

              numbers.map(num => (
                <div key={num.id}>
                  {num.data}
                </div>
              ))
            }
          </div>
      }
    </>
  );
}

export default App;
