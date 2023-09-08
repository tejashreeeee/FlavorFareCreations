const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    recipeid: {
    type: String,
    required: 'This field is required.'
  },
  
  
  
});


// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('save', saveSchema);