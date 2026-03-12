function handleError(err, req, res, next) {
    console.error(err)

    // It's not necessary use next() because we are sending a response
    res.status(err.status || 500).json({message: err.message || "Internal server error"})
}

module.exports = handleError