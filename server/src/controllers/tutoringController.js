const asyncHandler = require('express-async-handler');
const TutoringImage = require('../models/TutoringImage');

// @route GET /api/tutoring/images
// Public — powers the photo gallery on the Tutoring page.
const getTutoringImages = asyncHandler(async (req, res) => {
  const images = await TutoringImage.find({}).sort({ order: 1, createdAt: -1 });
  res.json(images);
});

// @route POST /api/admin/tutoring-images
const addTutoringImage = asyncHandler(async (req, res) => {
  const { url, caption, order } = req.body;
  if (!url) {
    res.status(400);
    throw new Error('Image URL is required');
  }

  const image = await TutoringImage.create({
    url,
    caption: caption || '',
    order: order || 0,
    createdBy: req.user._id
  });
  res.status(201).json(image);
});

// @route DELETE /api/admin/tutoring-images/:id
const deleteTutoringImage = asyncHandler(async (req, res) => {
  const image = await TutoringImage.findByIdAndDelete(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }
  res.json({ message: 'Image deleted' });
});

module.exports = { getTutoringImages, addTutoringImage, deleteTutoringImage };
