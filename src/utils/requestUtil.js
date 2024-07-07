import fetch from 'node-fetch'
/*
  A centralized api call function that serves as a boilerplate for all api calls regardless
  of the request method.
  It eases the need to add auth tokens everytime there is an authenticated request
  it basically serves as the entry point for api calls
  It mains a single source of truth
  
  @params {
    ** hasAuth: Boolean { basically infers that the request is an authenticated request or not } **
    ** type: GET | POST | PUT | PATCH | DELETE {defaults to get when none is provided} **
    ** url: string {api endpoint} Endpoint to call **
    ** payload: JSON.stringify(Object) payload on request**
  }
*/

const makeRequest = async (params) => {
  const { method, payload, authorization, url } = params
  const data = JSON.stringify(payload)

  const request = await fetch(url, {
    body: data,
    method: method,
  })

  if (request.status !== 200) {
    throw request.json()
  }

  return request
}

export { makeRequest }
