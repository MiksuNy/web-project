// POST /requests
const createRequest = (req, res) => {
  const { title, description } = req.body;

  res.status(201).json({
    message: 'Request created (mock)',
    request: { title, description }
  });
};

// GET /requests
const getRequests = (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Need help with groceries',
      description: 'Once per week'
    }
  ]);
};

module.exports = {
  createRequest,
  getRequests
};