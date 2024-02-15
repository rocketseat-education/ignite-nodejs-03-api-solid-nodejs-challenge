import { Org } from '@prisma/client'

import { OrgsRepository } from '@/repositories/orgs.repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'
import { compare } from 'bcryptjs'

interface AuthenticateOrgUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateOrgUseCaseResponse {
  org: Org
}

export class AuthenticateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOrgUseCaseRequest): Promise<AuthenticateOrgUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doestPasswordMatches = await compare(password, org.password)

    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}
