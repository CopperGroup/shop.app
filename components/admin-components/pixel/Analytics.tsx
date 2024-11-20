import { Eye, ShoppingCart, Package, Search } from 'lucide-react'
import { StatCard } from './StatCard'
import { ConversionChart } from './ConversionChart'
import { EventDistribution } from './EventDistribution'
import { ConversionFunnel } from './ConversionFunnel'
import { EventActivity } from './EventActivity'
import { EventTrends } from './EventTrends'

export function Analytics() {
  const eventData = [
    { name: 'Mon', pageView: 5000, viewContent: 4000, addToCart: 1000, addToWishlist: 500, initiateCheckout: 800, addPaymentInfo: 600, purchase: 500, search: 3000, lead: 200, completeRegistration: 100 },
    { name: 'Tue', pageView: 5500, viewContent: 4400, addToCart: 1100, addToWishlist: 550, initiateCheckout: 880, addPaymentInfo: 660, purchase: 550, search: 3300, lead: 220, completeRegistration: 110 },
    { name: 'Wed', pageView: 6000, viewContent: 4800, addToCart: 1200, addToWishlist: 600, initiateCheckout: 960, addPaymentInfo: 720, purchase: 600, search: 3600, lead: 240, completeRegistration: 120 },
    { name: 'Thu', pageView: 5800, viewContent: 4640, addToCart: 1160, addToWishlist: 580, initiateCheckout: 928, addPaymentInfo: 696, purchase: 580, search: 3480, lead: 232, completeRegistration: 116 },
    { name: 'Fri', pageView: 6500, viewContent: 5200, addToCart: 1300, addToWishlist: 650, initiateCheckout: 1040, addPaymentInfo: 780, purchase: 650, search: 3900, lead: 260, completeRegistration: 130 },
    { name: 'Sat', pageView: 7000, viewContent: 5600, addToCart: 1400, addToWishlist: 700, initiateCheckout: 1120, addPaymentInfo: 840, purchase: 700, search: 4200, lead: 280, completeRegistration: 140 },
    { name: 'Sun', pageView: 6200, viewContent: 4960, addToCart: 1240, addToWishlist: 620, initiateCheckout: 992, addPaymentInfo: 744, purchase: 620, search: 3720, lead: 248, completeRegistration: 124 },
  ]

  const conversionData = [
    { name: 'Page Views', value: 100, color: '#3b82f6' },
    { name: 'View Content', value: 80, color: '#60a5fa' },
    { name: 'Add to Cart', value: 20, color: '#10b981' },
    { name: 'Initiate Checkout', value: 16, color: '#fbbf24' },
    { name: 'Purchase', value: 10, color: '#f59e0b' },
  ]

  const eventDistributionData = Object.entries(eventData[6])
    .slice(1)
    .map(([name, value]) => ({ name, value }))

  const eventActivityData = Object.entries(eventData[6])
    .slice(1)
    .map(([name, value]) => ({ name: name.replace(/([A-Z])/g, ' $1').trim(), value }))
    .sort((a, b) => (b.value as number)  - (a.value as number))

  const conversionFunnelData = [
    { name: 'Page Views', value: eventData[6].pageView },
    { name: 'Add to Cart', value: eventData[6].addToCart },
    { name: 'Initiate Checkout', value: eventData[6].initiateCheckout },
    { name: 'Purchase', value: eventData[6].purchase },
  ]

  const eventOptions = [
    { value: 'pageView', label: 'Page Views' },
    { value: 'viewContent', label: 'View Content' },
    { value: 'addToCart', label: 'Add to Cart' },
    { value: 'addToWishlist', label: 'Add to Wishlist' },
    { value: 'initiateCheckout', label: 'Initiate Checkout' },
    { value: 'addPaymentInfo', label: 'Add Payment Info' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'search', label: 'Search' },
    { value: 'lead', label: 'Lead' },
    { value: 'completeRegistration', label: 'Complete Registration' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Page Views" value="42,000" icon={Eye} trend={5.2} />
        <StatCard title="Add to Cart Events" value="8,400" icon={ShoppingCart} trend={3.1} />
        <StatCard title="Purchase Events" value="4,200" icon={Package} trend={2.5} />
        <StatCard title="Search Events" value="25,200" icon={Search} trend={4.3} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ConversionChart data={conversionData} />
        <EventDistribution data={eventDistributionData as {name: string, value: number}[] } />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EventActivity data={eventActivityData as {name: string, value: number}[] } />
        <ConversionFunnel data={conversionFunnelData} />
      </div>

      <EventTrends data={eventData} eventOptions={eventOptions} />
    </div>
  )
}