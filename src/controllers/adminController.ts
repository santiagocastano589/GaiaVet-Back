import { Request, Response } from 'express';
import Empleado from '../models/empleadoModel';
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

