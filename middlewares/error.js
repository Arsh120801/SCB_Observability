const errorHandler = async(err, req, res, next) => {
    if (err) {
      res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    } else {
      next();
    }
  }

module.exports = errorHandler;