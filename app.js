// On importe le module Express
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// On définit les fichiers statiques que le serveur a le droit de servir.
app.use(express.static(path.join(__dirname, "public")));

// On définit une route pour la page d'accueil
// Lorsqu'un utilisateur va accéder à la racine ("/"), on va afficher "Hello World !"
// On va récupérer avec Express 2 arguments de fonction, qui sont req (Request) et res (Response).
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// On ajoute une route API pour notre chatbot
app.get("/api/chat", (req, res) => {
  const userMessage = req.query.message ?? "Aucunes données fournies";
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

  const users = [
    {
      id: 1,
      username: "Bob",
      email: "bob@test.fr"
    },
    {
      id: 2,
      username: "Alice",
      email: "alice@test.fr"
    },
    {
      id: 3,
      username: "John",
      email: "john@test.fr"
    }
  ];

  res.json({
    user: users[userId - 1]
  });
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