const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ extended: true }));
app.use(logger('dev'));

app.use(
	session({
		secret: process.env.sessionSecretKey,
		cookie: { secure: process.env.isHttps === 'true' },
		resave: false,
		saveUninitialized: false
	})
);

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/auth', require('./web-service/routes/auth'));
app.use('/data', require('./web-service/routes/data'));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerConfig)));
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
