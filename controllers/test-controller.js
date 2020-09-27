"use strict"

// const TempLog = require("../models/temperature-log-model")

const save = (req, res) => {
    return res.status(200).json({ message: "Success" })
}

module.exports = {
  save
}