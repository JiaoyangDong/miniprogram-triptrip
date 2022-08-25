const prettyDate = (date) => {
    let newDate = new Date(date)
    newDate = newDate.toLocaleDateString('en-us', {weekday: "short", month: "short", day: "numeric"})
    return newDate
}

module.exports = { prettyDate }