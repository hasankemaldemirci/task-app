const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/task-api-kata", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
