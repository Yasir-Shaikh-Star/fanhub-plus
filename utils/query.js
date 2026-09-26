const { Categories, Bookmarks } = require('../models');

function categoryById(id) {
  return Categories.findById(id);
}

function withCategory(record, catField = 'categoryId') {
  return { category: categoryById(record[catField]) };
}

function attachCategory(list, key, catField = 'categoryId') {
  return list.map((record) => ({ [key]: record, category: categoryById(record[catField]) }));
}

function avgRating(ratings) {
  if (!ratings || !ratings.length) return 0;
  return ratings.reduce((s, r) => s + r.stars, 0) / ratings.length;
}

function sortItems(list, sort, getRecord) {
  const arr = [...list];
  if (sort === 'popular') {
    arr.sort((a, b) => {
      const ra = getRecord(b);
      const rb = getRecord(a);
      const scoreB = (ra.popularityScore || 0) + avgRating(ra.ratings) * 10;
      const scoreA = (rb.popularityScore || 0) + avgRating(rb.ratings) * 10;
      return scoreB - scoreA;
    });
  } else if (sort === 'az') {
    arr.sort((a, b) => getRecord(a).title.localeCompare(getRecord(b).title));
  } else {
    arr.sort((a, b) => new Date(getRecord(b).createdAt || getRecord(b).releaseDate) - new Date(getRecord(a).createdAt || getRecord(a).releaseDate));
  }
  return arr;
}

function bookmarkedIdsFor(userId) {
  if (!userId) return [];
  return Bookmarks.find((b) => b.userId === userId).map((b) => b.targetId);
}

module.exports = { categoryById, withCategory, attachCategory, avgRating, sortItems, bookmarkedIdsFor };
