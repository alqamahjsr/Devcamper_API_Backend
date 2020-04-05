const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load Env Vars
dotenv.config({ path: './config/config.env' });

//Connect to Database
connectDB();

//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

//Body parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//File Uploading
app.use(fileupload());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(
		`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold,
	),
);

//Handle Unhandled Rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	//Close server and  exit process
	server.close(() => process.exit(1));
});
