const TrailModel = require("../models/trail");
// import the PerformerModel

//TrailModel can perform Crud operations on the database

module.exports = {
  new: newTrail,
  create,
  index,
  show,
  update,
  edit,
};

async function update(req, res) {
  try {
    const updatedTrail = await TrailModel.findOneAndUpdate(
      { _id: req.params.id },
      // update object with updated properties
      req.body,
      // options object {new: true} returns updated doc
      { new: true }
    );
    return res.redirect(`/trails/${updatedTrail._id}`);
  } catch (e) {
    console.log(e.message);
    return res.redirect("/trails");
  }
}

async function edit(req, res) {
  const trail = await TrailModel.findOne({ _id: req.params.id });
  if (!trail) return res.redirect("/trails");
  res.render("trails/edit", { trail });
}

function show(req, res) {
  console.log(req.user, " <- this is req.user");
  TrailModel.findById(req.params.id)
    .populate("") // pass the name of the key, with the id/id's
    .exec() // to execute the populate
    .then(function (trail) {
      console.log(trail); // <- trail is the object from the database!
      res.render("trails/show", { trail });
    });
}

function index(req, res) {
  //  the empty object {} is called a
  // query object, mongoose
  TrailModel.find({})
    // MovieModel.find is our mongoose model going to mongodb
    // to find all the movies in the movies collection
    // when the model comes back from the database
    // we want a function to run
    // that is the .then
    .then(function (allTrails) {
      console.log(allTrails, " <_ data from the db");
      // respond to the client in the .then, we have to wait
      // for the data to come back from the database
      res.render("trails/index", { trails: allTrails });
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
}

function create(req, res) {
  console.log(req.body, " <- contents of the form, req.body");

  // Asynchronous, The model, has to travel to talk to the database,
  // database is one another port, so it takes times for this to happen
  TrailModel.create(req.body)
    .then(function (trailWeCreatedInTheDb) {
      // This function is the callback, to the create method,
      // so this functions gets called after we get a response from the database
      // that we added the contents of the form (req.body) to the database
      console.log(trailWeCreatedInTheDb, " <- trail document");
      // Always respond to the client, in the cb function of the model
      // because we want to make sure the database performed its job before
      // we respond to the client
      res.redirect(`/trails/${trailWeCreatedInTheDb._id}`); // 404 because we haven't made the index route yet
    })
    .catch((err) => {
      console.log(err);
      res.send("There was an error check the terminal, or log the err object");
    });
  // I like to use res.send just to check if I'm able to make an
  // http request to my POST,
  // res.send('Hitting the Post Route, check the terminal for the contents of the form')
}

function newTrail(req, res) {
  // Render looks in the views folder
  res.render("trails/new");
}
