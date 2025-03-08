const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // Correction ici
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Utilisation correcte de body-parser

// Configuration email avec plus de détails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post("/api/newsletter/subscribe", async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation d'inscription - Kapita Analytics",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <img src="cid:banniere" style="width: 100%; height: auto; margin-bottom: 20px; border-radius: 8px;" />
          <h2 style="color: #1a365d;">Merci de votre inscription ${
            name || "Abonné"
          } !</h2>
          <p>Votre inscription à la newsletter de Kapita Analytics a bien été prise en compte.</p>
          <p>Vous recevrez désormais nos analyses économiques chaque semaine.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">© 2024 Kapita Analytics. Tous droits réservés.</p>
        </div>
      `,
      attachments: [
        {
          filename: "banniere.jpeg",
          path: __dirname + "/../logo/banniere.jpeg",
          cid: "banniere", // Identifiant unique pour référencer l'image dans le HTML
        },
      ],
    });

    res.status(200).json({ message: "Inscription réussie" });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      error: "Erreur lors de l'inscription",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
