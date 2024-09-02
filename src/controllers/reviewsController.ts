import { Response,Request, response } from "express";
import Reseña from "../models/reviewsModel";
import {CustomRequest} from '../middlewares/authMiddlaware'
import User from "../models/userModel";
import { request } from "http";
import { where } from "sequelize";



export const NewReview = async (req:CustomRequest,res:Response): Promise<Response> => {
    
    const correo = req['user']['correo']
    const user = await User.findOne({where:{correo}}) 

    if (!user) {
        return res.status(404).json('Error al encontrar el usuario')
    }
    try {

        const {idReseña,puntuacion,comentario,categoria,fk_idCita}=req.body;
        const cedulaR = user.cedula.toString()
    if (!idReseña||!cedulaR||!puntuacion||!comentario||!categoria||!fk_idCita) {
        res.status(400).json({message:'Error, Campos Vacios'})
    }
    const reseña = await Reseña.create({idReseña,cedulaR,puntuacion,comentario,categoria,fk_idCita})
        return res.status(200).json(reseña)
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear la reseña' });

    }

}

export const Reviews = async (req:Request,res:Response) : Promise<Response>=>{
    const categoria = req.body
    try {
        const Reseñas = Reseña.findAll({where:categoria});
        return res.status(200).json(Reseñas)
    } catch (error) {
        return res.status(404).json({message:"Error al obtener las Reseñas"})
    }
    

}

export const DeleteReviews = async (req:CustomRequest,res:Response): Promise<Response> => {

    const correo = req['user']['correo'];

    const user = await User.findAll({where:correo})

    if (!user) {
        return res.status(404).json({message:"No se encontro el usuario"})
    }

    try {
        const {idReseña} = req.body;
        const reseña = await Reseña.destroy({where:idReseña})
        return res.status(200).json(reseña)
    } catch (error) {
        return res.status(404).json({message:"Error al eliminar la reseña"})

    }

    
}

export const updateReseña =async (req:Request,res:Response):Promise<Response>=> {
    try {
        const {idReseña,puntuacion,comentario}=req.body;
    const reseña = await Reseña.findByPk(idReseña)
    if (reseña) {
        await reseña.update({
            puntuacion,
            comentario            
        })

    }
    const reseñaUpdate = await Reseña.findByPk(idReseña)
    return res.status(200).json(reseñaUpdate)
    } catch (error) {
        return res.status(200).json({message:"Error al actualizar la reseña"})

    }
    
    

}