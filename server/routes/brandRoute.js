import express from 'express';
import { getBrands, addBrand, deleteBrand, updateBrand } from '../controllers/brandController.js';

const brandRouter = express.Router();

brandRouter.post('/add', addBrand);
brandRouter.get('/list', getBrands);
brandRouter.post('/delete', deleteBrand);
brandRouter.post('/update', updateBrand);

export default brandRouter;
