import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import mammoth from "mammoth";
import cors from "cors";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfStore = require("pdf-parse");
const PDFParser = pdfStore.PDFParse || pdfStore.default?.PDFParse || pdfStore.default || pdfStore;

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("PDF Parser available:", typeof PDFParser === 'function' ? "Yes" : "No");

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  const storage = multer.memoryStorage();
  const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  });

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // API Route: Parse File to Text
  app.post("/api/parse", (req, res, next) => {
    console.log("Incoming request to /api/parse");
    next();
  }, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        console.error("No file received in request");
        return res.status(400).json({ error: "No file was uploaded." });
      }

      const { buffer, originalname, mimetype, size } = req.file;
      console.log(`Processing file: ${originalname} (${mimetype}, ${size} bytes)`);
      
      let text = "";
      const lowerName = originalname.toLowerCase();

      if (mimetype === "application/pdf" || lowerName.endsWith(".pdf")) {
        console.log(`Parsing PDF: ${originalname}`);
        try {
          // Check if it's a constructor or the old-style function
          if (PDFParser.prototype && PDFParser.prototype.constructor === PDFParser) {
            const parser = new PDFParser({ data: buffer });
            const result = await parser.getText();
            text = result.text;
          } else {
            // Fallback for old-style pdf-parse function version 1.x
            const data = await PDFParser(buffer);
            text = data.text;
          }
          console.log(`Successfully extracted ${text?.length || 0} characters from PDF`);
        } catch (pdfErr: any) {
          console.error("PDF Parsing error:", pdfErr);
          return res.status(500).json({ 
            error: "Failed to read the PDF document.", 
            details: pdfErr.message 
          });
        }
      } else if (
        mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        lowerName.endsWith(".docx")
      ) {
        console.log(`Parsing DOCX: ${originalname}`);
        try {
          const result = await mammoth.extractRawText({ buffer });
          text = result.value;
          console.log(`Successfully extracted ${text?.length || 0} characters from DOCX`);
        } catch (docxErr: any) {
          console.error("DOCX Parsing error:", docxErr);
          return res.status(500).json({ 
            error: "Failed to read the DOCX document.", 
            details: docxErr.message 
          });
        }
      } else if (mimetype === "text/plain" || lowerName.endsWith(".txt")) {
        console.log(`Parsing TXT: ${originalname}`);
        text = buffer.toString("utf8");
      } else {
        console.warn(`Unsupported file type attempted: ${mimetype} (${originalname})`);
        return res.status(400).json({ 
          error: "Unsupported file type.", 
          details: `The application currently only supports PDF, DOCX, and TXT files. received: ${mimetype}` 
        });
      }

      if (!text || text.trim().length === 0) {
        console.warn("Extracted text is empty");
        return res.status(400).json({ 
          error: "The file appears empty.", 
          details: "Could not find any readable text content in the uploaded document." 
        });
      }

      res.json({ text });
    } catch (error: any) {
      console.error("General API error:", error);
      res.status(500).json({ 
        error: "An unexpected error occurred during processing.", 
        details: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
