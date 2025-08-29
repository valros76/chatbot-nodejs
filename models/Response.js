const mongoose = require("mongoose");

// On definit notre shéma de données.
// Une question de la part de l'utilisateur et une réponse de la part du chatbot.
// Une question et une réponse, on a donc besoin du format "String", car ce sont des chaînes de caractères.
const responseSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Response", responseSchema, "chatbot");