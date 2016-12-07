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

	//TODO 백엔드 밸리데이션 추가하기
	if(!req.body.email){
		// 백엔드 밸리데이션은 이러한 식으로
		res.redirect('/contact?error='+'EMAIL_ERROR');
	}

	models.Contact.create({
		category: req.body.category,
		name: req.body.name,
		email: req.body.email,
		contents: req.body.contents
	}).then(data=>{
		var data = data.toJSON();
		var category = translateCategory(data.category);
		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: `"${data.name}" <${data.email}>`, // sender address
		    to: `${config.gmailID}@gmail.com`, // list of receivers
		    subject: `포트폴리오 사이트 문의사항 (${category})`, // Subject line
		    text: `${data.contents}`, // plaintext body
		    html: `<p>${data.contents}</p>` // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
				res.redirect('/contact?error='+'MAIL_ERROR');
		    } else {
		    	res.redirect('/contact?success=true');
			}
		});
	})
	.catch(err=>{
		//모델을 세이브할때 에러가 났다면
		res.redirect('/contact?error='+'MODEL_ERROR');
	});
	;
});

// TODO 영어 카테고리이름을 한글로 바꾸는 함수
function translateCategory(category){
	if(category == 'work')
		return '사이트문의'
	else
		return category;
}







module.exports = router;