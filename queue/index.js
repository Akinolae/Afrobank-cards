import { makeRequest } from '../src/utils/requestUtil.js'

let isProcessing = false

const coreProcessor = async ({ processorConfig, payload }) => {
  if (!Array.isArray(payload) || !payload.length) {
    throw new Error('Payload is required and must be an array')
  }

  if (isProcessing) {
    return
  }

  isProcessing = true

  console.log({ isProcessing }, 'a')
  const { callBackUrl, authorization } = processorConfig

  const response = await Promise.all(
    payload.map((dataToProcess) =>
      makeRequest({
        url: '/',
        method: 'post',
        payload: { ...dataToProcess },
      })
    )
  )

  isProcessing = false
}

export { coreProcessor }
