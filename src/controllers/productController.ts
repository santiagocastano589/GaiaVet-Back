import {Response , Request} from "express"

import Producto from "../models/productoModel"
import { json } from "body-parser"

export const  createProduct = async (req:Request,res:Response) => {
    try {
        const product = await Producto.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({message:'Error to product create'})
    }
}

export const updateProduct = async (req:Request,res:Response) => {
 
try {
    const {idProducto} = req.params;
    const product = await Producto.findByPk(idProducto);
    if (product) {
        await product.update(req.body);
        res.status(200).json(product)
    }else{
        res.status(404).json({message:'Product not found'})

    }

} catch (error) {
res.status(500).json({message:'Error to update product'})    
} 
    
}

export const deleteProduct = async (req:Request,res:Response) => {
    try {
        const {idProducto} = req.params
        const product = await Producto.findByPk(idProducto)
        if (product) {
            await product.destroy()
            res.status(200).json({message:'Product eliminated'})
        }else{
            res.status(404).json({message:'Product not found'})

        }
    } catch (error) {
        res.status(500).json({message:'Erro to delete product'})
    }

    }

   export const getAllProducts = async (req:Request,res:Response) => {
    try {

        const product = await Producto.findAll()
        if (product) {
            res.status(200).json(product)
        }else{
            res.status(404).json({message:'Product not found'})
        }
        
    } catch (error) {
        res.status(500).json({message:'Error to get products'})
    }


   } 
   export const getProductsById = async (req:Request,res:Response) => {
    try {

        const {idProducto} = req.params
        const product = await Producto.findByPk(idProducto)
        if (product) {
            res.status(200).json(product)
        }else{
            res.status(404).json({message:'Product not found'})
        }
        
    } catch (error) {
        res.status(500).json({message:'Error to get product'})
    }
   }
