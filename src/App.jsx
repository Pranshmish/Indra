import { useState } from 'react'
import Header from './component/Header'
// import './App.css'
// import Navbar from './Components/Navbar'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
    </>
  )
}

