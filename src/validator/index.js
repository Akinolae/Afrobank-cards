import joi from 'joi'

const cardCreationValidation = joi.object({
  card_label: joi.string().trim().required(),
  wallet_id: joi.string().trim().required(),
  address: joi.string().trim().required(),
  card_holder: joi.string().trim().required(),
})

export { cardCreationValidation }
