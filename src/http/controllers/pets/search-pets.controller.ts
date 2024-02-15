import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'

const querySchema = z.object({
  city: z.string().min(1),
  age: z.string().optional(),
  size: z.string().optional(),
  energy_level: z.string().optional(),
  environment: z.string().optional(),
})

export async function searchPetsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { city, age, size, energy_level, environment } = querySchema.parse(
    request.query,
  )

  const searchPetsUseCase = makeSearchPetsUseCase()

  try {
    const { pets } = await searchPetsUseCase.execute({
      city,
      age,
      size,
      energy_level,
      environment,
    })

    return reply.status(200).send({ pets })
  } catch (error) {
    console.error(error)

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
