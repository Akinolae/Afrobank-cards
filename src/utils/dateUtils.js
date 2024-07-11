const getMonthsAgo = (date) => {}
const getYear = (date) => {
  date = new Date(date) ?? new Date()
  return date.getFullYear()
}
export default {
  getYear,
  getMonthsAgo,
}
