const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/tasks", (req, res) => {
  res.status(201).send(req.body);
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));
