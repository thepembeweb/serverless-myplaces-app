import { PlaceItem } from '../models/PlaceItem'
import { PlaceAccess } from '../dataLayer/PlaceAccess'
import { parseUserId } from '../auth/utils'
import { CreatePlaceRequest } from '../requests/CreatePlaceRequest'
import { UpdatePlaceRequest } from '../requests/UpdatePlaceRequest'
import { PlaceUpdate } from '../models/PlaceUpdate'

const uuidv4 = require('uuid/v4')
const toDoAccess = new PlaceAccess()

const s3BucketName = process.env.BUCKET_NAME

export async function getAllPlace (jwtToken: string): Promise<PlaceItem[]> {
  const userId = parseUserId(jwtToken)
  return toDoAccess.getAllPlace(userId)
}

export function createPlace (
  createPlaceRequest: CreatePlaceRequest,
  jwtToken: string
): Promise<PlaceItem> {
  const userId = parseUserId(jwtToken)
  const id = uuidv4()
  return toDoAccess.createPlace({
    userId: userId,
    placeId: id,
    createdAt: new Date().getTime().toString(),
    done: false,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${id}`,
    ...createPlaceRequest
  })
}

export function updatePlace (
  updatePlaceRequest: UpdatePlaceRequest,
  placeId: string,
  jwtToken: string
): Promise<PlaceUpdate> {
  const userId = parseUserId(jwtToken)
  return toDoAccess.updatePlace(updatePlaceRequest, placeId, userId)
}

export function deletePlace (
  placeId: string,
  jwtToken: string
): Promise<string> {
  const userId = parseUserId(jwtToken)
  return toDoAccess.deletePlace(placeId, userId)
}

export function generateUploadUrl (placeId: string): Promise<string> {
  return toDoAccess.generateUploadUrl(placeId)
}
