// On importe le module Express
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Response = require("./models/Response"); // Importe le modèle Response, créé avec mongoose

const app = express();
const PORT = process.env.PORT || 3000;

// On définit les fichiers statiques que le serveur a le droit de servir.
app.use(express.static(path.join(__dirname, "public")));

// On permet la lecture des données JSON dans les requêtes HTTP avec Express
app.use(express.json());

mongoose.connect("mongodb+srv://webdevoopro_db_user:NextF0rmation42@cluster0.voyjctt.mongodb.net/")
.then(
  () => console.log("Connexion à la base MongoDB a réussi.")
)
.catch(
  err => console.error("Une erreur s'est produite lors de la connexion à la base de données", err)
);

// On définit une route pour la page d'accueil
// Lorsqu'un utilisateur va accéder à la racine ("/"), on va afficher "Hello World !"
// On va récupérer avec Express 2 arguments de fonction, qui sont req (Request) et res (Response).
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// On ajoute une route API pour notre chatbot
app.get("/api/chat", async (req, res) => {
  // On force le passage du message en minuscules pour faciliter la recherche.
  const userMessage = req.body.message.toLowerCase() ?? "Aucunes données fournies";
  // Logique simple : "Bonjour" peut importe la question posée.
  res.json({
    text: `Bonjour ! Vous avez dit : ${userMessage}.`
  });
});

// On ajoute une route API dynamique, pour consulter un profil utilisateur
app.get("/api/profile/:userId", (req, res) => {
  const userId = Number(req.params.userId) ?? undefined;


  if (!userId) {
    res.json({
      status: 404
    });
  }

  const users = require(path.join(__dirname, "public", "datas", "users.json"));

  res.json({
    user: users[userId - 1]
  });
});

// On a besoin d'une route d'initialisation des données, qui ne sera a apeller qu'une seule fois.
app.get("/api/init", async (req, res) => {
  try{

    // On supprime les questions et réponses existantes pour recommencer à utiliser le chatbot
    await Response.deleteMany({});

    // On ajoute les questions et réponses prédéfinies
    await Response.insertMany([
      {
        question: "horaires",
        answer: "Nous sommes ouvert de 09h00 à 18h00."
      },
      {
        question: "retours",
        answer: "Vous pouvez retourner un article dans les 30 jours suivant la date d'achat."
      },
      {
        question: "contact",
        answer: "Vous pouvez nous contacter par email à l'adresse test@mail.fr ou par téléphone au 06-01-02-03-04."
      }
    ]);

    res.json({
      message: "Les données ont été initialisée dans la base de données."
    });

  }catch(err){
    res.status(500).json({
      error: err.message
    });
  }
});

// La dernière route à indiquer au serveur, c'est la gestion des routes non trouvées, soit l'erreur 404.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// On va écouter le port défini (par défaut, le port 3000), pour démarrer le serveur et avoir un point de contact.
// Le serveur sera accessible sur http://localhost:PORT, soit http://localhost:3000 par défaut.
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}.`);
  console.log(`Accédez à l'url : http://localhost:${PORT}`);
});