import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeAuthenticateOrgUseCase } from '@/use-cases/factories/make-authenticate-org-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'

const bodySchema = z.object({
  email: z.string(),
  password: z.string(),
})

export async function authenticateOrgController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = bodySchema.parse(request.body)

  const authenticateOrgUseCase = makeAuthenticateOrgUseCase()

  try {
    const { org } = await authenticateOrgUseCase.execute(body)

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
        },
      },
    )

    return reply.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
