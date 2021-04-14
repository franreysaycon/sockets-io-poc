import React, { useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [numbers, setNumbers] = useState([])

  const socket = io("ws://localhost:8000")

  socket.on("connect", () => {
    console.log("CONNECTED!")
  });

  socket.on("new alerts", data => {
    console.log(data)
    setNumbers([...numbers, data])
  });

  return (
    <div>
      {
        numbers.map(num => (
          <div key={num.id}>
            {num.data}
          </div>
        ))
      }
    </div>
  );
}

export default App;
