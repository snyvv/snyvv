var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var models = require('../models');
var config = require('../config');

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: 'Gmail',
	auth: {
		user: config.gmailID,
		pass: config.gamilPW
	}
});

/* get contact */
router.get('/', (req, res, next)=>{
  res.render('contact',{
		title: "CONTACT | 웹퍼블리셔 김신영",
		pageTitle : "CONTACT"
	});
});

/* post contact */
router.post('/', (req, res, next)=>{
	models.Contact.create({
		category: req.body.category,
		name: req.body.name,
		email: req.body.email,
		contents: req.body.contents
	}).then(data=>{
		var data = data.toJSON();

		var mailOptions = {
			from: `${data.name} <${data.emil}>`,
			to: config.gamilID,
			subject: `SNYVV : ${data.name}님의 Contact`,
			text: `${data.contents}`
		};

		smtpTransport.sendMail(mailOptions, function(error, response){

			if (error){
				console.log(error);
				throw err;
			} else {
				console.log("Message sent : " + response.contents);
			}
			smtpTransport.close();
			res.send('Thank U');
		});
	});
});

module.exports = router;