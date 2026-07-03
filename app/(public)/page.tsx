import Hero from '@/components/sections/Hero'
import FeatureShowcase from '@/components/sections/FeatureShowcase'
import Categories from '@/components/sections/Categories'
import HowItWorks from '@/components/sections/HowItWorks'
import FeaturedBikes from '@/components/sections/FeaturedBikes'
import WhyUs from '@/components/sections/WhyUs'
import Reviews from '@/components/sections/Reviews'
import FaqTeaser from '@/components/sections/FaqTeaser'
import CtaBanner from '@/components/sections/CtaBanner'
import BikeReport from '@/components/sections/BikeReport'
import { readReviews, readFaqs, readHeroImages, readOpeningHours } from '@/lib/data-server'

export default async function HomePage() {
  const [reviews, faqs, heroImages, openingHours] = await Promise.all([readReviews(), readFaqs(), readHeroImages(), readOpeningHours()])

  const firstImage = heroImages[0] ?? { desktop: '/hero/hero-1.jpg', mobile: '/hero/hero-1-mobile.jpg' }

  return (
    <>
      {/* Preload first hero image — browser fetches it before JS runs */}
      <link rel="preload" as="image" href={firstImage.desktop} media="(min-width: 768px)" fetchPriority="high" />
      {firstImage.mobile && (
        <link rel="preload" as="image" href={firstImage.mobile} media="(max-width: 767px)" fetchPriority="high" />
      )}
      <Hero images={heroImages} openingHours={openingHours} />
      <FeatureShowcase />
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
