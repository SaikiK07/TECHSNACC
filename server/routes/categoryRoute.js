import express from 'express';
import { getCategories, addCategory, deleteCategory, updateCategory } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.post('/add', addCategory);
categoryRouter.get('/list', getCategories);
categoryRouter.post('/delete', deleteCategory);
categoryRouter.post('/update', updateCategory);  // New route for updating a category

export default categoryRouter;
