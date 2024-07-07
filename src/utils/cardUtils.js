import { GenCC } from 'creditcard-generator'
import * as uuid from 'uuid'
import { generateString, characterTypes } from './userUtils.js'

const generateCreditCard = (card_schema = 'Mastercard') => {
  return GenCC(card_schema)[0]
}

const generateCvv = () => {
  return generateString({ length: 3, type: characterTypes.NUMERIC })
}

const dateExpiration = () => {
  const date = new Date()
  const year = String(date.getFullYear() + 2).slice(-2)
  const month = String(date.getMonth() + 1)
  return {
    month: month < 10 ? `0${month}` : month,
    year,
  }
}

const preparedCardData = ({ params }) => {
  const cardNumber = generateCreditCard()
  const cvv = +generateCvv()

  return {
    ...params,
    card_schema: 'Mastercard',
    card_id: uuid.v4(),
    card_number: cardNumber,
    expiry: `${dateExpiration().month}/${dateExpiration().year}`,
    cvv,
    card_status: 'ACTIVE',
    balance: 0,
    card_mask_span: `*********${cardNumber.slice(-4)}`,
  }
}

export { generateCreditCard, preparedCardData }
