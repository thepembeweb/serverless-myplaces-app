import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { getAllPlace } from '../../businessLogic/Place'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getPlace')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // PLACE: Get all PLACE items for a current user
    logger.info('Processing Event ', event)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const toDos = await getAllPlace(jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: toDos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
