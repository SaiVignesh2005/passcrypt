import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
//import Footer from './components/footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <div>
        <Homepage/>
      </div>
    </>
  )
}

export default App
