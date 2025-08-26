const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const upload = multer();
const app = express();

app.post("/grayscale", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Envie um arquivo no campo 'image'.");
    }

    const mode = req.query.mode;   // ?mode=mono → preto e branco puro
    const format = (req.query.format || "png").toLowerCase();

    let img = sharp(req.file.buffer).grayscale();
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
