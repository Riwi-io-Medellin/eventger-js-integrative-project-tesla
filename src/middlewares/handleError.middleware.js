function handleError(err, req, res) {
    console.error(err)

    const status = err.status || 500

    // It's not necessary use next() because we are sending a response
    res.status(status).json({message: err.message || "Internal server error"})
}

module.exports = handleError