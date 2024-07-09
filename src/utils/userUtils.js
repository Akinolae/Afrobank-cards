import CryptoJS from 'crypto'

const characterTypes = {
  NUMERIC: 'numeric',
  ALPHABETH: 'alphabeth',
  ALPHA_NUMERIC: 'alphanumeric',
}

const useCrypto = ({ payLoad = '', token, encrypt = true }) => {
  let data
  const message =
    typeof payLoad === 'string' ? payLoad : JSON.stringify(payLoad)
  if (encrypt) {
    data = CryptoJS.AES.encrypt(message, token).toString()
  } else {
    const decryptCode = CryptoJS.AES.decrypt(message, token)
    data = decryptCode.toString(CryptoJS.enc.Utf8)
  }
  return data
}

const generateString = ({ length, type = characterTypes.NUMERIC }) => {
  let result = ''
  let characters
  switch (type) {
    case characterTypes.NUMERIC:
      characters = '1234567890'
      break
    case characterTypes.ALPHABETH:
      characters = 'abcdefghijklmnopqrstuvwxyz'
      break
    case characterTypes.ALPHA_NUMERIC:
      characters = 'abcdefghijklmnopqrstuvwxyz1234567890*@#$%^'
    default:
      break
  }
  length = length ?? characters.length

  for (var i = 0; i < length; i++) {
    result +=
      characters.toUpperCase()[Math.floor(Math.random() * characters.length)]
  }
  return result
}

const generateUserAccessKey = () => {
  return generateString({ length: 15, type: characterTypes.ALPHA_NUMERIC })
}

export { useCrypto, generateString, generateUserAccessKey, characterTypes }
