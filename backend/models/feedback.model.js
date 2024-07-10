const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  review: {
    type: String,
    required : true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

});

feedbackSchema.set('toJSON', { getters: true, virtuals: false });

const FeedBackModel = mongoose.model('FeedBack', feedbackSchema);
module.exports = FeedBackModel;
