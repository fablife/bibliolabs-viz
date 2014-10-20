exports.handle_error = (exception, text, res, code=500) ->
    console.log(text)
    console.log exception
    res.statusCode = code
    res.end(text)

