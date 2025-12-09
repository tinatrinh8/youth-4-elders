import { getPartners, getSponsors } from '@/lib/contentful'
import PartnerClient from './PartnerClient'

export default async function Partner() {
  // Fetch partners and sponsors from Contentful
  const partners = await getPartners()
  const sponsors = await getSponsors()

  return <PartnerClient partners={partners} sponsors={sponsors} />
}
