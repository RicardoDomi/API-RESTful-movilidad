
function apiKeyMiddleware(req, res, next) {
    try {
        console.log("HEADERS >>>", req.headers); 

        const providedKey = req.headers["x-api-key"];
        const validKey = process.env.HISTORY_APIKEY;

        if (!validKey) {
            console.error(" HISTORY_APIKEY no configurada en el entorno");
            return res.status(500).json({ error: "Server misconfiguration" });
        }

        if (!providedKey) {
            return res.status(401).json({ error: "API key requerida" });
        }

        if (providedKey !== validKey) {
            return res.status(401).json({ error: "API key inválida" });
        }

        next();
    } catch (error) {
        console.error("Error en apiKeyMiddleware:", error);
        return res.status(500).json({ error: "Internal middleware error" });
    }
}

module.exports = apiKeyMiddleware;
 