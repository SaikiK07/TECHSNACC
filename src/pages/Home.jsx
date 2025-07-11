import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <Testimonials />
      <OurPolicy/>
    </div>
  )
}

export default Home