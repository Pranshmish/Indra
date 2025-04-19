import { useState } from 'react'
import Header from './component/Header'
import WetherCard from './component/wetherCard'



export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='m-8 border border-width: 1px'>
        <Header />
        <hr className='mx-3' />
        <WetherCard />
      </div>
      
    </>
  )
}

