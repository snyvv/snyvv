var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var models = require('../models');
var config = require('../config');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(`smtps://${config.gmailID}%40gmail.com:${config.gmailPW}@smtp.gmail.com`);

/* get contact */
router.get('/', (req, res, next)=>{
  res.render('contact',{
		title: "문의하기 | 웹퍼블리셔 김신영",
		pageTitle : "문의하기",
		pageName : "contact"
	});
});

/* post contact */
router.post('/', (req, res, next)=>{

	if(!req.body.email){
		res.json({status:500,msg:'EMAIL_ERROR'}).end();
	}
	models.Contact.create({
		category: req.body.category,
		name: req.body.name,
		email: req.body.email,
		contents: req.body.contents
	}).then(data=>{
		var data = data.toJSON();

		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: `"${data.name}" <${data.email}>`, // sender address
		    to: `${config.gmailID}@gmail.com`, // list of receivers
		    subject: `포트폴리오 사이트 문의사항 (${data.category})`, // Subject line
		    text: `${data.contents}`, // plaintext body
		    html: `<p>${data.contents}</p>` // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
				console.log(error);
		    	res.json({status:500,msg:'MAIL_ERROR'}).end();
		    } else {
		    	res.json({status:200,msg:'OK'}).end();
			}
		});
	})
	.catch(err=>{
		console.log(err);
	});
	;
});







module.exports = router;