const Review = require('../models/Review');

// GET all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET reviews by product
const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true 
    }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single review
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name')
      .populate('product', 'name');
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST new review
const createReview = async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;
    
    // Validación
    if (!user || !product || !rating || !comment) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    if (comment.length > 500) {
      return res.status(400).json({ error: 'Comment must be 500 characters or less' });
    }

    const newReview = new Review({
      user,
      product,
      rating,
      comment
    });

    const savedReview = await newReview.save();
    await savedReview.populate('user', 'name').populate('product', 'name');
    res.status(201).json(savedReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    res.status(500).json({ error: error.message });
  }
};

// PUT update review approval
const updateReviewApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ error: 'isApproved must be a boolean' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    ).populate('user', 'name').populate('product', 'name');

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE review
const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewsByProduct,
  getReviewById,
  createReview,
  updateReviewApproval,
  deleteReview
};