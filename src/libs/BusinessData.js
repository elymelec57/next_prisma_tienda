import { cache } from 'react'
import { prisma } from './prisma'

// getPost will be used twice, but execute only once
export const BusinessData = cache(async (slug) => {
  const res = await prisma.restaurant.findFirst({
    where: {
      slug: slug
    },
  });

  const logo = await prisma.image.findFirst({
    where: {
      id: res.mainImageId
    },
    select: {
      url: true
    }
  })

  let restaurante = {
    ...res,
    logo: logo.url
  }

  return restaurante
})