import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case'
import { PetNotFoundError } from '@/use-cases/errors/pet-not-found.error'

const routeSchema = z.object({
  id: z.string(),
})

export async function getPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = routeSchema.parse(request.params)

  const getPetUseCase = makeGetPetUseCase()

  try {
    const { pet } = await getPetUseCase.execute({ id })

    return reply.status(200).send(pet)
  } catch (error) {
    if (error instanceof PetNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    console.error(error)

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
