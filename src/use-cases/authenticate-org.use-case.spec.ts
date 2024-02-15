import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs.repository'
import { makeOrg } from '@tests/factories/make-org.factory'
import { AuthenticateOrgUseCase } from '@/use-cases/authenticate-org.use-case'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'

describe('Authenticate Org Use Case', () => {
  let orgsRepository: InMemoryOrgsRepository
  let sut: AuthenticateOrgUseCase

  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOrgUseCase(orgsRepository)
  })

  it('should be able to authenticate an org', async () => {
    const password = '123456'

    const org = await orgsRepository.create(
      makeOrg({ password: await hash(password, 8) }),
    )

    const { org: authenticatedOrg } = await sut.execute({
      email: org.email,
      password,
    })

    expect(authenticatedOrg).toEqual(org)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const password = '123456'

    const org = await orgsRepository.create(
      makeOrg({ password: await hash(password, 8) }),
    )

    await expect(() =>
      sut.execute({
        email: org.email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
