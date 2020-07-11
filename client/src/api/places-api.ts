import { apiEndpoint } from '../config'
import { Place } from '../types/Place'
import { CreatePlaceRequest } from '../types/CreatePlaceRequest'
import Axios from 'axios'
import { UpdatePlaceRequest } from '../types/UpdatePlaceRequest'

export async function getPlaces (idToken: string): Promise<Place[]> {
  console.log('Fetching places')

  const response = await Axios.get(`${apiEndpoint}/places`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  // console.log('Places:', response.data)
  return response.data.items
}

export async function createPlace (
  idToken: string,
  newPlace: CreatePlaceRequest
): Promise<Place> {
  const response = await Axios.post(
    `${apiEndpoint}/places`,
    JSON.stringify(newPlace),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchPlace (
  idToken: string,
  placeId: string,
  updatedPlace: UpdatePlaceRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/places/${placeId}`,
    JSON.stringify(updatedPlace),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deletePlace (
  idToken: string,
  placeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/places/${placeId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl (
  idToken: string,
  placeId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/places/${placeId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile (
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
