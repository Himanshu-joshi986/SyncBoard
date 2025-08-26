require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('SyncBoard backend running'));

// mount routers
app.use('/auth', require('./routes/auth'));
app.use('/calendar', require('./routes/calendar'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
