import Hero from '@/components/sections/Hero'
import QuickBook from '@/components/sections/QuickBook'
import Categories from '@/components/sections/Categories'
import HowItWorks from '@/components/sections/HowItWorks'
import FeaturedBikes from '@/components/sections/FeaturedBikes'
import WhyUs from '@/components/sections/WhyUs'
import Reviews from '@/components/sections/Reviews'
import FaqTeaser from '@/components/sections/FaqTeaser'
import CtaBanner from '@/components/sections/CtaBanner'
import BikeReport from '@/components/sections/BikeReport'
import { readReviews, readFaqs } from '@/lib/data-server'

export default async function HomePage() {
  const [reviews, faqs] = await Promise.all([readReviews(), readFaqs()])

  return (
    <>
      <Hero />
      <QuickBook />
      <Categories />
      <HowItWorks />
      <FeaturedBikes />
      <WhyUs />
      <BikeReport />
      <Reviews reviews={reviews} />
      <FaqTeaser faqs={faqs} />
      <CtaBanner />
    </>
  )
}
