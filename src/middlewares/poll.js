/**
 *
 * @param {{[key: string] : any}} data
 */
const isVoteDataValid = (data) => {
  if (
    'signature' in data &&
    'candidateId' in data &&
    'voter' in data &&
    'voterHash' in data &&
    'proof' in data
  ) {
    if (Array.isArray(data['proof'])) {
      return true;
    }
  }

  return false;
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
const validateVoteData = (req, res, next) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid body data, body should be an array',
    });
  }

  const voteDataValid = data.every(isVoteDataValid);
  if (!voteDataValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
    });
  }

  next();
};

module.exports = { validateVoteData };
