import { Request, response, Response } from 'express';
import Producto from '../models/productoModel';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { error } from 'console';
interface Product {
  idProduct: string;
  count: number;
  title: string;
  price: number;
}

// Define el tipo de cuerpo de la solicitud
interface CreatePreferenceRequest extends Request {
  body: {
    products: Product[];
  };
}

export const createProducto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { imagen, nombreProducto, categoria, descripcion, stock, precio } = req.body;
    
    const nuevoProducto = await Producto.create({
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
  const products = req.body.products;

  if (!Array.isArray(products)) {
    res.status(400).json({ error: "El campo 'products' debe ser un array" });
    return;
  }

  try {
    const body = {
      items: products.map(product => ({
        id: product.idProduct,
        title: product.title,
        quantity: Number(product.count),
        unit_price: Number(product.price),
        currency_id: "COP"
      })),
      back_urls: {
        success: "https://www.youtube.com/watch?v=-e_3Cg9GZFU",
        failure: "https://www.youtube.com/watch?v=-e_3Cg9GZFU",
        pending: "https://www.youtube.com/watch?v=-e_3Cg9GZFU"
      },
      notification_url: "https://gaiavet-back.onrender.com/webhook", // URL del webhook
      auto_return: "approved"
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    if (result && result.id) {
      res.json({
        id: result.id,
      });
    } else {
      res.status(500).json({
        error: "No se pudo crear la preferencia"
      });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({
      error: "Error al crear la preferencia"
    });
  }
};

export const webhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = req.body;

    if (payment.type === "payment" && payment.data.status === "approved") {
      const products = payment.data.additional_info.items;

      await Promise.all(products.map((product: any) =>
        updateStock(product.id as string, product.quantity as number)
      ));
      res.status(200).send('Stock actualizado');
    } else {
      res.status(200).send('Pago no aprobado, no se actualiza stock');
    }
  } catch (error) {
    console.error("Error en el webhook:", error);
    res.status(500).send("Error en el webhook");
  }
};

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

    product.stock = (product.stock || 0) - count;

    if (product.stock < 0) {
      console.error(`El stock del producto ${productId} no puede ser negativo.`);
      return;
    }

    await product.save();
  } catch (error) {
    console.error(`Error al actualizar el stock del producto ${productId}:`, error);
    throw error;
  }
};