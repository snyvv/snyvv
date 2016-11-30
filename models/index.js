var path = require('path');
var config = require('../config');
var fs = require('fs');
var moment = require('moment');
// 어플리케이션 처음에 DB에 연결하고 BookShelf 객체를 돌려주는 곳이 필요

let dbConfig = {
  debug: process.env.QUERY=='YES',
  client: 'mysql',
  connection: {
		host     : '127.0.0.1',
		user     : config.username,
		password : config.password,
		database : config.database,
		charset  : 'utf8'
  }
};

if (process.env.MIG=='YES') {
	dbConfig.pool = {max:1};
}


var knex = require('knex')(dbConfig);
/*
module.exports = require('bookshelf')(knex);

// 다른곳에서 BookShelf를 사용하는 곳
var bookshelf = require('./bookshelf');

var Post = bookshelf.Model.extend({
  // ...
});
*/

// const knex = require('knex')(dbConfig);
const bookshelf = require('bookshelf')(knex)
	.plugin('registry')
	.plugin('pagination')
	.plugin('visibility')
	.plugin('virtuals')
	// npm install bookshelf-modelbase --save
	.plugin(require('bookshelf-modelbase').pluggable);

	// load models
	let models = {};
	let modelBuilders = {};
	fs.readdirSync(__dirname).forEach(fileName => {
	   if (path.join(__dirname, fileName) == __filename || fileName[0] == '.') return;

	   let modelName = fileName.slice(0, -3);
	   let modelBuilder = require(path.join(__dirname, fileName));

	   if (modelBuilder.methods) {
	      let methods = modelBuilder.methods;
	      delete modelBuilder.methods;

	      models[modelName] = bookshelf.model(modelName, modelBuilder);
	      for (let k in methods) {
	         models[modelName][k] = methods[k];
	      }

	   } else {
	      models[modelName] = bookshelf.model(modelName, modelBuilder);
	   }
	   
	});

	models.transaction = knex.transaction;
	models.query = knex.raw;
	module.exports = models;

if(process.env.MIG == 'YES'){
// 테이블이 있으면 없애고 테이블 생성하기.

  let promise = Promise.resolve().then(() => {
		console.log('* migration begin');
		return knex.raw('set FOREIGN_KEY_CHECKS=0');
  });

  promise = promise.then(() => {
		console.log('* dropping all tables');
		return knex.schema
			.dropTableIfExists('users')
			.dropTableIfExists('portfolios')
			.dropTableIfExists('contacts')
			.dropTableIfExists('comments')
			.dropTableIfExists('tags')
			.dropTableIfExists('portfolios_tags')

			// 테이블생성
			.createTable('users', (table) => {
				console.log('* create table users');
				table.increments('id').primary();
				table.string('uid').notNullable().unique();
				table.string('name').notNullable().unique();
				table.string('password').notNullable();
				table.string('email').notNullable();
				table.timestamps();
			})
			.createTable('portfolios', (table) => {
				console.log('* create table portfolios');
				table.increments('id').primary();
				table.string('name').notNullable();
				table.string('image');
				table.string('contents').notNullable();
				table.datetime('date').notNullable();
				table.integer('user_id').unsigned().references('users.id').notNullable(); // forign key for users
				table.timestamps();
			})
			.createTable('contacts', (table) => {
				console.log('* create table contacts');
				table.increments('id').primary();
				table.enu('category', ['site','work','etc']);
				table.string('name').notNullable();
				table.string('email').notNullable();
				table.string('contents').notNullable();
				table.timestamps();
			})
			.createTable('comments', (table) => {
				console.log('* create table comments');
				table.increments('id').primary();
				table.string('comments').notNullable();
				// not member
				table.string('email');
				table.string('password');
				table.string('name');
				// when member
				table.integer('user_id').unsigned().references('users.id');
				table.integer('portfolio_id').unsigned().references('portfolios.id');
				table.timestamps();
			})
			.createTable('tags', (table) => {
				console.log('* create table tags');
				table.increments('id').primary();
				table.string('name');
			})
			.createTable('portfolios_tags', (table) => { // pebut table
				console.log('* create table portfolio_tags');
				table.integer('portfolio_id').unsigned().references('portfolios.id').notNullable();
				table.integer('tag_id').unsigned().references('tags.id').notNullable();
			})
			.catch(err=>{
				console.log(err);
			});
		});


	promise = promise.then(()=>{
		console.log("* dummy data *");
		console.log("create users");
		return Promise.all([
				models.User.create({
					uid: "admin",
					name:"관리자",
					email:"test@test.com",
					password:"11111111"
				}),
				models.User.create({
					uid: "guest",
					name:"손님",
					email:"guest@guest.com",
					password:"11111111"
				})
			]);
		}).then(()=>{
			console.log('create comments');
			return Promise.all([
				models.Comment.create({
					name:"댓글러",
					email:"guest2@guest.com",
					password:"11111111",
					comments:"hihi",
					portfolio_id:1
				}),
				models.Comment.create({
					user_id:1,
					comments:"admin",
					portfolio_id:1
				})
			]);
		})
		.then(()=>{
			console.log("create tags");
			return Promise.all([
				models.Tag.create({
					name:"tag1"
				}),
				models.Tag.create({
					name:"tag2"
				})
			])
		})
		.then(()=>{
			console.log('create portfolio');
			return Promise.all([
				models.Portfolio.create({
					name:"포트폴리오1",
					image:"/img/favicon.png",
					contents:"컨텐츠입니다",
					date: moment('2014-10-12 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
					user_id:1
				}),
				models.Portfolio.create({
					name:"포트폴리오2",
					image:"/img/visual.jpg",
					contents:"컨텐츠입니다",
					date: moment('2015-10-12 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
					user_id:1
				})
			]);
		})
		.then(()=>{
			console.log('create contact');
			return Promise.all([
				models.Contact.create({
					category:"etc",
					name:"콩아지",
					email:"kongkong@naver.com",
					contents:"누나 사랑해요"
				}),
				models.Contact.create({
					category:"site",
					name:"미스안",
					email:"missahn@naver.com",
					contents:"힘내세요"
				})
			]);
		})
		.then(result=>{
				console.log('* many to many relation');
				 return Promise.all([
					 		models.Tag.forge({id:1}).portfolios().attach([result[0],result[1]]),
					 		models.Tag.forge({id:2}).portfolios().attach(result[1])
				 ]);
			})
		.catch(err=>{
			console.log(err);
		});

	promise = promise.then(()=>{
		console.log('* migration end, need to restart without MIG=YES');
		return knex.raw('set FOREIGN_KEY_CHECKS=1');
	});

}




/*
new User(req.body).save()
    .then(function(user){
     // this is important
      return user.courses().attach(courses_ids);
    }).catch(function(error){
       console.log(error);
    });
*/