const buildPostQuery = (query = {}) => {
  const { category, location, type } = query;

  const filter = {};
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (type) filter.type = type;

  const limit = parseInt(query.limit, 10) || 20;
  const offset = parseInt(query.offset, 10) || 0;

  return { filter, limit, offset };
};

module.exports = { buildPostQuery };