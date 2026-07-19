const express = require('express');
const path = require('path');

const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/', adminRoutes);
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Blog starter listening on port ${PORT}`);
});
