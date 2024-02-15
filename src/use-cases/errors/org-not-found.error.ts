export class OrgNotFoundError extends Error {
  constructor() {
    super('Organization not found.')
  }
}
