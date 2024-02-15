export class OrgAlreadyExistsError extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}
