import { cache } from 'react'
import { prisma } from './prisma'

// getPost will be used twice, but execute only once
export const BusinessData = cache(async (slug) => {
  const res = await prisma.restaurant.findFirst({
    where: {
      slug: slug
    },
  });

  if (!res) {
    return null;
  }

  let logoUrl = null;
  if (res.mainImageId) {
    const logo = await prisma.image.findFirst({
      where: {
        id: res.mainImageId
      },
      select: {
        url: true
      }
    });
    if (logo) {
      logoUrl = logo.url;
    }
  }

  let restaurante = {
    ...res,
    logo: logoUrl
  }

  return restaurante
})