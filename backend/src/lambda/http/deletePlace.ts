import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { deletePlace } from '../../businessLogic/Place'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('deletePlace')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // PLACE: Remove a PLACE item by id
    logger.info('Processing Event ', event)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const placeId = event.pathParameters.placeId

    const deleteData = await deletePlace(placeId, jwtToken)

    return {
      statusCode: 200,
      body: deleteData
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
