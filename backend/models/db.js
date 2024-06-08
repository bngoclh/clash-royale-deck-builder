const mongoose = require("mongoose");
const config = require("../config");

// URL de connexion à MongoDB
//const url = ""; // Modifier l'URL si nécessaire

const url = config.mongoURI.prod;

const options = {};

mongoose.set("strictQuery", true);

// Connexion à la base de données MongoDB
mongoose.connect(url, options)
    .then(() => console.log("Connexion à la base de données établie avec succès"))
    .catch((err) => console.error("Erreur lors de la connexion à la base de données :", err));

mongoose.connection.on("connecting", () => {console.log("Connection");})

mongoose.connection.on("error", () => {console.log("Connection error");})
    
mongoose.connection.on("disconnected", () => {console.log("Disconnected");})
    
mongoose.connection.on("reconnecting", () => {console.log("Reconnecting");})
    
mongoose.connection.on("connected", () => {console.log("Connection to database successfully established");})
    
    

// Export de la connexion à la base de données
module.exports = mongoose.connection;
