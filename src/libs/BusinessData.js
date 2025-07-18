import { cache } from 'react'
import { prisma } from './prisma'
 
// getPost will be used twice, but execute only once
export const BusinessData = cache(async (slug) => {
  const res = await prisma.business.findFirst({ 
    where: {
      slug: slug 
    }
  });
  return res
})