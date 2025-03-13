const newsletterModel = require('../../models/newsletter');

exports.getAll = async (req, res) => {
    const newsletters = await newsletterModel.find();

    return res.json(newsletters);
};

exports.create = async (req, res) => {
    try {
        const { email } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // بررسی تکراری نبودن ایمیل
        const existingEmail = await newsletterModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newEmail = await newsletterModel.create({ email });

        return res.status(201).json(newEmail);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
