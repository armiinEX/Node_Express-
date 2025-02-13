const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

console.log(PORT);

(async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/sabzlearn");
        console.log('✅ Connected to MongoDB ... :)');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1); // خروج از برنامه در صورت خطا
    }
})();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});