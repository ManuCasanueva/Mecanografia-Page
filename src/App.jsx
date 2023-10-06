import { useState } from 'react'
import MecanoEasy from './components/MecanoEasy/MecanoEasy'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MecanoEasy/>
    </>
  )
}

export default App
