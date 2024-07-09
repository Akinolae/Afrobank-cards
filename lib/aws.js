import awsCommands, {
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'
import dotenv from 'dotenv'
dotenv.config()

const cognito = new CognitoIdentityProviderClient({
  apiVersion: 'latest',
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRETE_ACCESS_KEY,
  },
})

const cognitoApifn = async (command, args) => {
  const cognitoCommand = new command({ ...args })

  try {
    return await cognito.send(cognitoCommand)
  } catch (error) {
    throw error
  }
}

const getUserFromCognito = async (args) => {
  const { AccessToken } = args
  const command = new awsCommands.GetUserCommand({ AccessToken })
  try {
    return await cognito.send(command)
  } catch (error) {
    throw error
  }
}

const getValueFromAttributes = (attributes = [], params) => {
  return attributes.find((user) => user.Name === params).Value
}

export { cognito, cognitoApifn, getUserFromCognito, getValueFromAttributes }
