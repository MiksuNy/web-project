const buildPostQuery = (query = {}) => {
  const { category, location, type, searchText } = query;

  const filter = {};
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (type) filter.type = type;
  if (searchText) {
    filter.$or = [
      { title: { $regex: searchText, $options: "i" } },
      { description: { $regex: searchText, $options: "i" } },
    ];
  }

  const limit = parseInt(query.limit, 10) || 20;
  const offset = parseInt(query.offset, 10) || 0;

  return { filter, limit, offset };
};

module.exports = { buildPostQuery };