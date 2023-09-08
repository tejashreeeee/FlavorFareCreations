const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  contact: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  password: {
    type: String,
    required: 'This field is required.'
  },
  
  
});

recipeSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('user', recipeSchema);