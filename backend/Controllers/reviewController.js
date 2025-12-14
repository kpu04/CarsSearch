'use strict';
const { Review, User } = require('../Models');

exports.createReview = async (req, res) => {
  try {
    const { userId, coment } = req.body;
    const user = userId ? await User.findByPk(userId) : null;

    const review = await Review.create({
      userId: user ? user.id : null,
      coment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });

    const result = reviews.map((r) => ({
      id: r.id,
      coment: r.coment,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: r.User ? { username: r.User.username } : { username: 'user' },
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    await review.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
