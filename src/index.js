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
        const { title, quantity, unit_price } = req.body;

        if (!title || !quantity || !unit_price) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const preferenceData = {
            items: [
                {
                    title: title,
                    quantity: Number(quantity),
                    unit_price: Number(unit_price),
                    currency_id: 'ARS'
                }
            ],
            back_urls: {
                success: 'https://tu-sitio.com/success',
                failure: 'https://tu-sitio.com/failure',
                pending: 'https://tu-sitio.com/pending'
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
    console.log(`Servidor en puerto ${port}`);
});