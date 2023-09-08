require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const user = require('../models/user');




exports.homepage = async(req, res) => {
   
  try{
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, thai, american, chinese };


    res.render('index', { title: 'Flavorfarecreations - Home',categories,food } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
   
  }

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Flavorfarecreations - Categories', categories } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'lavorfarecreations - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Flavorfarecreations - Recipe', recipe } );
  } catch (error) {
    // res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
}
exports.login = async(req, res) => {

  res.render('login', { title: 'Cooking Blog - Submit Recipe' } );
}
exports.home = async(req, res) => {

  res.render('home', { title: 'Cooking Blog - Submit Recipe' } );
}

exports.about = async(req, res) => {

  res.render('about', { title: 'Cooking Blog - Submit Recipe' } );
}

exports.loginOnPost = async(req, res) => {
  try {
    let password = req.body.password;
    let user = await user.findOne( { $text: { $search: password, $diacriticSensitive: true } });
    res.render('login', { title: 'Flavorfarecreations - Search' } );
  } catch (error) {
    res.render('home', { title: 'Flavorfarecreations - Search' } );
  }
  
}



exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Flavorfarecreations - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Flavorfarecreations - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    // res.redirect('/submit-recipe');
  }
}



exports.register = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('register', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}


exports.registerOnPost= async(req, res) => {
  try {

 

    const newRecipe = new user({
      name: req.body.name,
     
      email: req.body.email,
      contact: req.body.contact,
      password: req.body.password,
      
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Registerd successfully')
    res.redirect('/register');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    // res.redirect('/submit-recipe');
  }
}





