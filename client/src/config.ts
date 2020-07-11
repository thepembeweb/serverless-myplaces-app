// PLACE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'bhai59lina'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // PLACE: Create an Auth0 application and copy values from it into this map
  domain: 'dev-rru3uclr.us.auth0.com', // Auth0 domain
  clientId: 'tQ3mFeL8aZzdLa5UBdjCm20QIri3FYBe', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
