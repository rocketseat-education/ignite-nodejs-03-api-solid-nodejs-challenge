import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets.repository'
import { SearchPetsUseCase } from '@/use-cases/search-pets.use-case'

export function makeSearchPetsUseCase() {
  return new SearchPetsUseCase(new PrismaPetsRepository())
}
