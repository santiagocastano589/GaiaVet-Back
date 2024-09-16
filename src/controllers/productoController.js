"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFactura = exports.webhook = exports.preferences_ = exports.deleteProducto = exports.updateProducto = exports.getProducts = exports.createProducto = void 0;
const productoModel_1 = __importDefault(require("../models/productoModel"));
const mercadopago_1 = require("mercadopago");
const console_1 = require("console");
const detalleFacturaModel_1 = __importDefault(require("../models/detalleFacturaModel"));
const FacturaCompraModel_1 = __importDefault(require("../models/FacturaCompraModel"));
const createProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProducto, imagen, nombreProducto, categoria, descripcion, stock, precio } = req.body;
        const nuevoProducto = yield productoModel_1.default.create({
            idProducto,
            imagen,
            nombreProducto,
            categoria,
            descripcion,
            stock,
            precio
        });
        return res.status(201).json(nuevoProducto);
    }
    catch (error) {
        console.error('Error al crear producto:', error);
        return res.status(500).json({ message: 'Error al crear producto' });
    }
});
exports.createProducto = createProducto;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productoModel_1.default.findAll();
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos.' });
    }
});
exports.getProducts = getProducts;
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProducto } = req.params;
        const { imagen, nombreProducto, categoria, descripcion, stock, precio } = req.body;
        const producto = yield productoModel_1.default.findByPk(idProducto);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        yield producto.update({
            imagen,
            nombreProducto,
            categoria,
            descripcion,
            stock,
            precio
        });
        return res.status(200).json(producto);
    }
    catch (error) {
        console.error('Error al actualizar producto:', error);
        return res.status(500).json({ message: 'Error al actualizar producto' });
    }
});
exports.updateProducto = updateProducto;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idProducto } = req.params;
        const producto = yield productoModel_1.default.findByPk(idProducto);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        yield producto.destroy();
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar producto:', error);
        return res.status(500).json({ message: 'Error al eliminar producto' });
    }
});
exports.deleteProducto = deleteProducto;
const client = new mercadopago_1.MercadoPagoConfig({ accessToken: 'APP_USR-8827196264162858-081217-755e5d2b5e722ca8f3c7042df40dbed3-1941685779' });
const preferences_ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = req.body.products;
    if (!Array.isArray(products)) {
        res.status(400).json({ error: "El campo 'products' debe ser un array" });
        return;
    }
    try {
        const body = {
            items: products.map((product) => ({
                id: product.idProduct,
                title: product.title,
                quantity: Number(product.count),
                unit_price: Number(product.price),
                currency_id: "COP",
            })),
            back_urls: {
                success: "https://gaiavet-back.onrender.com/webhook",
                failure: "https://gaiavet-back.onrender.com/webhook",
                pending: "https://gaiavet-back.onrender.com/webhook",
            },
            auto_return: "approved",
            notification_url: "https://gaiavet-back.onrender.com/webhook"
        };
        const preference = new mercadopago_1.Preference(client);
        const result = yield preference.create({ body });
        if (result && result.id) {
            res.json({ id: result.id });
        }
        else {
            res.status(500).json({ error: "No se pudo crear la preferencia" });
        }
    }
    catch (error) {
        console.error("Error al crear la preferencia:", error);
        res.status(500).json({ error: "Error al crear la preferencia" });
    }
});
exports.preferences_ = preferences_;
const webhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = req.query;
        if (typeof payment.payment_id !== 'string') {
            res.status(400).json({ error: 'Payment ID inválido' });
            return;
        }
        const accessToken = 'APP_USR-8827196264162858-081217-755e5d2b5e722ca8f3c7042df40dbed3-1941685779';
        const response = yield fetch(`https://api.mercadopago.com/v1/payments/${payment.payment_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = yield response.json();
            throw new Error(`Error fetching payment: ${errorData.message}`);
        }
        const paymentData = yield response.json();
        console.log(paymentData);
        const items = yield paymentData.additional_info.items;
        // Verifica que los datos de la tarjeta y el id del producto sean válidos
        if (!paymentData.card || !paymentData.card.cardholder || !paymentData.card.cardholder.identification) {
            console.log('Información de la tarjeta incompleta');
            throw new Error('Información de la tarjeta incompleta');
        }
        const idProducto = yield paymentData.card.cardholder.identification.number;
        // Verifica que los detalles de la transacción sean válidos
        if (!paymentData.transaction_details || typeof paymentData.transaction_details.total_paid_amount !== 'number') {
            console.log('Detalles de la transacción incompletos');
            throw new Error('Detalles de la transacción incompletos');
        }
        const totalPrecio = yield paymentData.transaction_details.total_paid_amount;
        // Verifica que los items sean válidos
        if (!paymentData.additional_info || !Array.isArray(paymentData.additional_info.items)) {
            console.log('Items de la factura no válidos');
            throw new Error('Items de la factura no válidos');
        }
        const fechaa = yield paymentData.money_release_date;
        // Mapeo de los items con validaciones adicionales
        const facturaCreada = yield (0, exports.createFactura)(idProducto, totalPrecio, fechaa, items);
        if (!facturaCreada) {
            console.log(console_1.error);
            return;
        }
        //Actualiar el stock de los productos
        yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const productId = item.id;
            const count = parseInt(item.quantity, 10);
            if (isNaN(count) || count < 0) {
                throw new Error(`Cantidad inválida para el producto ${productId}`);
            }
            yield updateStock(productId, count);
        })));
        res.status(200).json({ message: "Compra Exitosa!!" });
    }
    catch (error) {
        console.error('Error en el webhook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.webhook = webhook;
//  money_release_date: '2024-09-13T10:09:27.000-04:00',
const updateStock = (productId, count) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productoModel_1.default.findByPk(productId);
        if (!product) {
            console.error(`Producto con ID ${productId} no encontrado.`);
            return;
        }
        if (count < 0) {
            console.error('El valor de count no puede ser negativo.');
            return;
        }
        product.stock = Math.max(0, product.stock || 0) - count; // Ensure stock doesn't go negative
        yield product.save();
    }
    catch (error) {
        console.error(`Error al actualizar el stock del producto ${productId}:`, error);
        throw error; // Re-throw error for potential handling in the calling function
    }
});
const createFactura = (fk_cedula, total, fecha, items) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("INTENTA CREAR LA FACTURA");
    try {
        if (!fk_cedula || !total || items.length === 0) {
            console.log('Datos incompletos para la factura');
        }
        const fechaSr = fecha.toString().split('T')[0]; // convierte a YYYY-MM-DD
        const nuevaFactura = yield FacturaCompraModel_1.default.create({
            fk_cedula,
            fecha: fechaSr,
            total,
        });
        const facturaId = nuevaFactura.idFacturaC;
        for (const item of items) {
            yield detalleFacturaModel_1.default.create({
                fk_idFacturaC: facturaId,
                fk_idProducto: item.id,
                cantidad: item.quantity,
                precioUnitario: item.unit_price,
            });
        }
        return true;
    }
    catch (error) {
        console.error('Error al crear la factura:', error);
        return false;
    }
});
exports.createFactura = createFactura;
