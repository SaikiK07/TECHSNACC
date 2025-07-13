import express from 'express';
import { contact, getContacts, deleteContact } from '../controllers/contactController.js';

const contactRouter = express.Router();

contactRouter.post('/add', contact);
contactRouter.get('/list', getContacts);
contactRouter.post('/delete', deleteContact);

export default contactRouter;
