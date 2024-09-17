import { DeleteReviews, NewReview, Reviews } from "../controllers/reviewsController";
import { accessRole, authenticate } from "../middlewares/authMiddlaware";
import { Router } from 'express';

const router = Router();


router.post('/NewReview',authenticate,accessRole('User'),NewReview)
router.get('/Reviews',Reviews)
router.delete('/RemoveReview',authenticate,accessRole('User'),DeleteReviews)

export default router
 