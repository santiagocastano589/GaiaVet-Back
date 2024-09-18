import { Request, response, Response } from 'express';
import Producto from '../models/productoModel';
import { MercadoPagoConfig, Preference } from 'mercadopago';


import { error, log } from 'console';
import DetalleFactura from '../models/detalleFacturaModel';
import fCompra from '../models/FacturaCompraModel';
import { DATE } from 'sequelize';
interface Product {
  idProduct: string;
  count: number;
  title: string;
  price: number;
}

interface Item {
  id: string;
  quantity: string;
  title: string;
  unit_price: string;
}

interface Payment {
  data: {
    status: string; 
    additional_info: {
      items: Array<{
        idProducto: string; 
        quantity: number;   
      }>;
    };
  };
}

export const createProducto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {idProducto, imagen, nombreProducto, categoria, descripcion, stock, precio } = req.body;
    
    const nuevoProducto = await Producto.create({
      idProducto,
      imagen,
      nombreProducto,
      categoria,
      descripcion,
      stock,
      precio
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ message: 'Error al crear producto' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Producto.findAll();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ message: 'Error al obtener los productos.' });
    }
  };

  export const updateProducto = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { idProducto } = req.params;
      const { imagen, nombreProducto, categoria, descripcion, stock, precio } = req.body;
  
      const producto = await Producto.findByPk(idProducto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      await producto.update({
        imagen,
        nombreProducto,
        categoria,
        descripcion,
        stock,
        precio
      });
  
      return res.status(200).json(producto);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return res.status(500).json({ message: 'Error al actualizar producto' });
    }
  };
  
  export const deleteProducto = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { idProducto } = req.params;
  
      const producto = await Producto.findByPk(idProducto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      await producto.destroy();
  
      return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return res.status(500).json({ message: 'Error al eliminar producto' });
    }
  };

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-8827196264162858-081217-755e5d2b5e722ca8f3c7042df40dbed3-1941685779' });

export const preferences_ = async (req: Request, res: Response): Promise<void> => {
  const products = req.body.products as Product[]; // Type assertion for clarity

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
      notification_url: "https://gaiavet-back.onrender.com/webhook"// URL del webhook


    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    if (result && result.id) {
      res.json({ id: result.id });
    } else {
      res.status(500).json({ error: "No se pudo crear la preferencia" });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
};




export const webhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = req.query;

    // Verifica que el payment_id sea una cadena
    if (typeof payment.payment_id !== 'string') {
      res.status(400).json({ error: 'Payment ID inválido' });
      return;
    }

    const accessToken = 'APP_USR-8827196264162858-081217-755e5d2b5e722ca8f3c7042df40dbed3-1941685779';
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment.payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching payment: ${errorData.message}`);
    }

    const paymentData = await response.json();
    console.log(paymentData);
    const items = await paymentData.additional_info.items;


    // Verifica que los datos de la tarjeta y el id del producto sean válidos
    if (!paymentData.card || !paymentData.card.cardholder || !paymentData.card.cardholder.identification) {
      console.log('Información de la tarjeta incompleta');
      
      throw new Error('Información de la tarjeta incompleta');
    }

    const idProducto = await paymentData.card.cardholder.identification.number;

    // Verifica que los detalles de la transacción sean válidos
    if (!paymentData.transaction_details || typeof paymentData.transaction_details.total_paid_amount !== 'number') {
      console.log('Detalles de la transacción incompletos');
      
      throw new Error('Detalles de la transacción incompletos');
    }

    const totalPrecio = await paymentData.transaction_details.total_paid_amount;

    // Verifica que los items sean válidos
    if (!paymentData.additional_info || !Array.isArray(paymentData.additional_info.items)) {
      console.log('Items de la factura no válidos');
      
      throw new Error('Items de la factura no válidos');
    }

    const fechaa = await paymentData.money_release_date

    // Mapeo de los items con validaciones adicionales
    const facturaCreada = await createFactura(
      idProducto,
      totalPrecio,
      fechaa,
      items
      
    );

    if (!facturaCreada) {
      console.log(error);
      return;
    }

    // Actualizar el stock
    await Promise.all(
      items.map(async (item: Item) => {
        const productId = item.id;
        const count = parseInt(item.quantity, 10);
        if (isNaN(count) || count < 0) {
          throw new Error(`Cantidad inválida para el producto ${productId}`);
        }
        await updateStock(productId, count);
      })
    );

    res.status(200).json(paymentData);

  } catch (error) {
    console.error('Error en el webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//  money_release_date: '2024-09-13T10:09:27.000-04:00',


const updateStock = async (productId: string, count: number): Promise<void> => {
  try {
    const product = await Producto.findByPk(productId);

    if (!product) {
      console.error(`Producto con ID ${productId} no encontrado.`);
      return;
    }

    if (count < 0) {
      console.error('El valor de count no puede ser negativo.');
      return;
    }

    product.stock = Math.max(0, product.stock || 0) - count; // Ensure stock doesn't go negative
    await product.save();
  } catch (error) {
    console.error(`Error al actualizar el stock del producto ${productId}:`, error);
    throw error; // Re-throw error for potential handling in the calling function
  }
};
export const createFactura = async (
  fk_cedula: string,
  total: number,
  fecha: String,
  items: Array<{ id: number, quantity: number, unit_price: number }>,
): Promise<boolean> => {
  console.log("Los items son:", JSON.stringify(items, null, 2));

  try {
    if (!fk_cedula || !total) {
      console.log('Datos incompletos para la factura');
      return false;
    }

    const fechaSr = fecha.toString().split('T')[0]; // convierte a YYYY-MM-DD

    const nuevaFactura = await fCompra.create({
      fk_cedula,
      fecha: fechaSr,
      total
    });

    try {
      
    const facturaId = nuevaFactura.idFacturaC;

    for (const item of items) {
      const quantity = Number(item.quantity);
      const unit_price = Number(item.unit_price);

      await DetalleFactura.create({
        fk_idFacturaC: facturaId,
        fk_idProducto: item.id,
        cantidad: quantity,
        precioUnitario: unit_price,
      });
    }

    return true;
    } catch (error) {
      console.error("eRROR",error);
      
    }
    return false

  } catch (error) {
    console.error('Error al crear la factura:', error);
    return false;
  }
};
