const express = require("express");
const sharp = require("sharp");

const app = express();

// Middleware: aceita corpo binário de imagens até 10MB
app.use(express.raw({ type: 'image/*', limit: '10mb' }));

app.post("/grayscale", async (req, res) => {
  try {
    if (!req.body || !req.body.length) {
      return res.status(400).send("Nenhuma imagem recebida.");
    }

    const buffer = req.body;

    // Query params: ?mode=mono → preto e branco puro
    // ?format=png|jpeg|webp → formato da saída
    const mode = req.query.mode;
    const format = (req.query.format || "png").toLowerCase();

    let img = sharp(buffer).grayscale();
    if (mode === "mono") {
      img = img.threshold(128);
    }

    let mime = "image/png";
    if (format === "jpeg" || format === "jpg") {
      img = img.jpeg();
      mime = "image/jpeg";
    } else if (format === "webp") {
      img = img.webp();
      mime = "image/webp";
    } else {
      img = img.png();
      mime = "image/png";
    }

    const output = await img.toBuffer();
    res.set("Content-Type", mime);
    res.send(output);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao processar imagem.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
