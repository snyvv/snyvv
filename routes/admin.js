var express = require('express');
var router = express.Router();
var config = require('../config');
var multer= require('multer');
var path = require('path');
var models = require('../models');

// 이미지들이 저장될곳
var imagePath = { 
	portfolio :path.join(__dirname,'..','public','img', 'portfolio'),
	blog : path.join(__dirname,'..','public','img', 'blog'), 
};


var storage = {
	portfolio:
		multer.diskStorage({
		  // 서버에 저장할 폴더
		  destination: function (req, file, cb) {
		    cb(null, imagePath.portfolio);
		  },
		  // 서버에 저장할 파일 명
		  filename: function (req, file, cb) {
		    cb(null, file.originalname);
		  }
		}),
	blog:
		multer.diskStorage({
		  // 서버에 저장할 폴더
		  destination: function (req, file, cb) {
		    cb(null, imagePath.blog);
		  },
		  // 서버에 저장할 파일 명
		  filename: function (req, file, cb) {
		    cb(null, file.originalname);
		  }
		})
};

// 파일 저장 설정
var upload = {
	portfolio : multer({ storage: storage.portfolio }),
	blog : multer({ storage: storage.blog }),
};



router.get('/', (req, res, next)=>{
	if(req.session.admin){
		res.redirect('/admin/main');
	}else{
		res.render('admin/login',{
			title: "LOGIN | 웹퍼블리셔 김신영 ADMIN",
			pageTitle: "LOGIN"
		});
	}
});

router.post('/', (req, res, next)=>{
	var admin = {
		id: config.gmailID,
		password: config.gmailPW
	}
	if(admin.id == req.body.id && admin.password == req.body.password){
		req.session.admin = true;
		res.redirect('/admin/main');
	}else{
		res.redirect('/admin?error=login');
	}
});

router.use((req,res,next)=>{
	//TODO
	req.session.admin = true;
	if(req.session.admin)
		next();
	else {
		var err = new Error('ERROR');
  		err.status = 500;
  		next(err);
	}
});


router.get('/main', (req, res, next)=>{
	res.render('admin/main',{
		title: "ADMIN",
		pageTitle: "홈"
	});
});

router.get('/portfolio',(req,res)=>{
	res.render('admin/portfolio/list',{
		title:'포트폴리오 관리 | ADMIN',
		pageTitle:'포트폴리오 관리'
	});
});

router.get('/portfolio/write',(req,res)=>{
	res.render('admin/portfolio/write',{
		title:'포트폴리오 작성 | ADMIN',
		pageTitle:'포트폴리오 작성'
	});
});

router.get('/portfolio/modify',(req,res)=>{
	res.render('admin/portfolio/modify',{
		title:'포트폴리오 수정 | ADMIN',
		pageTitle:'포트폴리오 수정'
	});
});

function createTagIfNotExist(data){
	return models.Tag.findOne({name:data})
	// TODO : 영어 
	// 만약 없는 것이라면
	.catch(err=>{
		return models.Tag.create({
			name:data,
			eng:data
		});
	});
}

router.post('/portfolio/write',(req,res)=>{
	

		var tagPromise=[];
		tagPromise.push(
			models.Portfolio.create({
							name: req.body.name,
							subname: req.body.subname,
							image: req.body.image,
							contents: req.body.contents,
							date:moment('12/06/2016','MM/DD/YYYY').toDate(),
			})
		);
		req.body.tag.split(', ').forEach(data=>{
			tagPromise.push(createTagIfNotExist(data));
		});

		Promise.all(tagPromise)
		.then(result=>{
				portfolioId = result[0].get('id');
		 		return models.Portfolio.forge({id:portfolioId}).tags().attach(result.split(1, result.length-1))
		})
		.then(data =>{
			res.redirect('/portfolio/'+req.body.name);
		});
});


// upload file
router.post('/portfolio/upload', upload.portfolio.array('file',20) ,(req,res)=>{
	res.json({status:200}).end();
});

router.get('/blog',(req,res)=>{
	res.render('admin/blog/list',{
		title:'블로그 관리 | ADMIN',
		pageTitle:'블로그 관리'
	});
});

router.get('/blog/write',(req,res)=>{
	res.render('admin/blog/write',{
		title:'블로그 작성 | ADMIN',
		pageTitle:'블로그 작성'
	});
});

router.get('/blog/modify',(req,res)=>{
	res.render('admin/blog/modify',{
		title:'블로그 수정 | ADMIN',
		pageTitle:'블로그 수정'
	});
});

router.get('/comment',(req,res)=>{
	res.render('admin/comment',{
		title:'댓글 관리 | ADMIN',
		pageTitle:'댓글 관리'
	});
});

router.get('/contact',(req,res)=>{
	res.render('admin/contact',{
		title:'문의 관리 | ADMIN',
		pageTitle:'문의 관리'
	});
});


/* get login 
router.get('/', (req, res, next)=>{
	res.render('login',{
		title: "LOGIN | 웹퍼블리셔 김신영",
		pageTitle : "LOGIN"
	});
});*/

/* post login 
router.post('/', (req, res, next)=>{
	models.User.findOne({
		uid : req.body.uid,
		password : req.body.password
	},{require:true})
	.then(user=>{
		// login success
		req.session.user = user.toJSON();
		res.redirect('/');
	})
	.catch(err=>{
		console.log(err);
		res.redirect('/login?error=login');
	});
});*/

module.exports = router;