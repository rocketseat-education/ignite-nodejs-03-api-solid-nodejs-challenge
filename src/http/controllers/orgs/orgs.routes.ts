import { FastifyInstance } from 'fastify'

import { createOrgController } from '@/http/controllers/orgs/create-org.controller'
import { authenticateOrgController } from '@/http/controllers/orgs/authenticate-org.controller'
import { fetchNearbyOrgsController } from '@/http/controllers/orgs/fetch-nearby-orgs.controller'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', createOrgController)
  app.post('/orgs/authenticate', authenticateOrgController)
  app.get('/orgs/nearby', fetchNearbyOrgsController)
}
