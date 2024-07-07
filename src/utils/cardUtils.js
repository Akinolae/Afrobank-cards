import { GenCC } from 'creditcard-generator'
import * as uuid from 'uuid'

const generateCreditCard = (card_schema = 'Mastercard') => {
  return GenCC(card_schema)[0]
}

const preparedCardData = () => {}

export { generateCreditCard }
