const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

console.log(PORT);

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB ... :)');
})();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});