import * as AWS from 'aws-sdk'
import * as AWSXRAY from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Types } from 'aws-sdk/clients/s3'
import { PlaceItem } from '../models/PlaceItem'
import { PlaceUpdate } from '../models/PlaceUpdate'

const XAWS = AWSXRAY.captureAWS(AWS)

export class PlaceAccess {
  constructor (
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly placeTable = process.env.PLACE_TABLE,
    private readonly s3BucketName = process.env.BUCKET_NAME
  ) {}

  async getAllPlace (userId: string): Promise<PlaceItem[]> {
    console.log('Getting all place')

    const params = {
      TableName: this.placeTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()
    console.log(result)
    const items = result.Items

    return items as PlaceItem[]
  }

  async createPlace (placeItem: PlaceItem): Promise<PlaceItem> {
    console.log('Creating new place')

    const params = {
      TableName: this.placeTable,
      Item: placeItem
    }

    const result = await this.docClient.put(params).promise()
    console.log(result)

    return placeItem as PlaceItem
  }

  async updatePlace (
    placeUpdate: PlaceUpdate,
    placeId: string,
    userId: string
  ): Promise<PlaceUpdate> {
    console.log('Updating place')

    const params = {
      TableName: this.placeTable,
      Key: {
        userId: userId,
        placeId: placeId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done'
      },
      ExpressionAttributeValues: {
        ':a': placeUpdate['name'],
        ':b': placeUpdate['dueDate'],
        ':c': placeUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    console.log(result)
    const attributes = result.Attributes

    return attributes as PlaceUpdate
  }

  async deletePlace (placeId: string, userId: string): Promise<string> {
    console.log('Deleting place')

    const params = {
      TableName: this.placeTable,
      Key: {
        userId: userId,
        placeId: placeId
      }
    }

    const result = await this.docClient.delete(params).promise()
    console.log(result)

    return '' as string
  }

  async generateUploadUrl (placeId: string): Promise<string> {
    console.log('Generating URL')

    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: placeId,
      Expires: 3000
    })
    console.log(url)

    return url as string
  }
}
