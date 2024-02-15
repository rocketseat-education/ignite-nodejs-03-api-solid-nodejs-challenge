import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyUseCase } from '@/use-cases/factories/make-fetch-nearby-use-case'

const querySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

export async function fetchNearbyOrgsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const query = querySchema.parse(request.query)

  const fetchNearbyUseCase = makeFetchNearbyUseCase()

  try {
    const { orgs } = await fetchNearbyUseCase.execute({
      userLatitude: query.latitude,
      userLongitude: query.longitude,
    })

    return reply.status(200).send({ orgs })
  } catch (error) {
    console.error(error)

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
