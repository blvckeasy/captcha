async function errorHandler (err, req, res, next) {

  if (Object.keys(Errors).some(function (errorName) {
    return errorName === err.name
  })) {
    return res.send({
      ok: false,
      error: err,
      errorName: err.name,
      status: err.status,
    })
  }

  return res.send({
    ok: false,
    errorName: "InternalServerError",
    status: 500,
  })
}

module.exports = errorHandler