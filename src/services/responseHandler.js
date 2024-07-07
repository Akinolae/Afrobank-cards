const response = ({ message, success, code, res, token, data }) => {
  res.status(code).json({
    success,
    message,
    token,
    data,
  })
}

export { response }
