import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatePlaceRequest } from '../../requests/UpdatePlaceRequest'
import { updatePlace } from '../../businessLogic/Place'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // PLACE: Update a PLACE item with the provided id using values in the "updatedPlace" object
    console.log('Processing Event ', event)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const placeId = event.pathParameters.placeId
    const updatedPlace: UpdatePlaceRequest = JSON.parse(event.body)

    const toDoItem = await updatePlace(updatedPlace, placeId, jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: toDoItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
