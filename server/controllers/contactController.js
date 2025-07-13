import contactModel from '../modles/contactModel.js';
import validator from "validator";

// Handle new contact messages
export const contact = async (req, res) => {
    const { username, email, subject, message } = req.body;
    
    try {
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const newContact = new contactModel({ username, email, subject, message });
        await newContact.save();
        return res.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Fetch all contact messages
export const getContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find();
        return res.json({ success: true, contacts });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete a contact message
export const deleteContact = async (req, res) => {
    const { id } = req.body;

    try {
        await contactModel.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Message deleted successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
