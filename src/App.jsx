import { useState } from 'react'
import Header from './component/Header'
import WetherCard from './component/wetherCard'



export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=''>
        <WetherCard />
      </div>
      
    </>
  )
}

