import express from "express";
import { join } from "node:path";

const app = express();
const distFolder = join(process.cwd(), "dist/Finnancer/browser");

// Servir archivos estáticos
app.use(
    express.static(distFolder, {
        maxAge: "1y",
        index: false,
        redirect: false,
    })
);

// Capturar cualquier ruta y devolver index.html
app.use((req, res) => { 
    res.sendFile(join(distFolder, "index.html"));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`CSR server running on port ${port}`);
});
