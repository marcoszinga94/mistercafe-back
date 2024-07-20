import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Configurar MercadoPago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint para crear preferencia de pago
app.post('/pay', async (req, res) => {
    console.log("Received body:", req.body);
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Se requiere un array de items válido' });
        }

        const preferenceItems = items.map(item => ({
            title: item.title,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            currency_id: 'ARS'
        }));

        const preferenceData = {
            items: preferenceItems,
            back_urls: {
                success: 'https://mistercafe.vercel.app/success',
                failure: 'https://mistercafe.vercel.app/failure',
                pending: 'https://mistercafe.vercel.app/pending'
            },
            auto_return: "approved"
        };

        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceData });
        res.json({
            id: result.id,
        });
    } catch (error) {
        console.error("Error creating preference:", error);
        res.status(500).json({
            error: 'Error al crear la preferencia',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor en puerto http://localhost:${port}`);
});