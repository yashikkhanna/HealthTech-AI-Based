import React from 'react'
import Hero from '../components/Hero'
import Biography from '../components/Biography'
import Messageform from '../components/Messageform'
import Department from '../components/Department'

const Home = () => {
  return (
   <>
   <Hero 
   title={"Welcome to ZeeCare Medical Institute | Your Trusted HealthCare Provider"}
   imageUrl={"/hero.png"}
   />
   <Biography imageUrl={"/about.png"}/>
   <Department/>
   <Messageform/>
   
   </>
  )
}

export default Home
