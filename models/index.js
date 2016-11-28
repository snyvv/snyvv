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

/*
  promise = promise.then(() => {
		console.log('* dropping all tables');
		return knex.schema
			.dropTableIfExists('users')
			.dropTableIfExists('portfolios')
			.dropTableIfExists('comments')
			.dropTableIfExists('tags')
			.dropTableIfExists('portfolio_tags')

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
				table.string('contents').notNullable();
				table.datetime('date').notNullable();
				table.integer('user_id').unsigned().references('users.id').notNullable(); // forign key for users
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
			.createTable('portfolio_tags', (table) => { // pebut table
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
			return Promise.all([
				models.User.create({
					uid:"snyvv",
					name:"시녕이",
					password:"zhdRkrwltlsud",
					email:"snyvv88@gmail.com"
				}),
				models.User.create({
					uid:"missahn",
					name:"미스안",
					password:"zhdRkrwltlsud",
					email:"missahn@naver.com"
				})
			]);
		}).then(()=>{
			return Promise.all([
				models.Portfolio.create({
					name:"project1",
					date:moment('2016-06-25 10:34:22').format('YYYY-MM-DD HH:mm:ss'),
					contents:"컨텐츠",
					user_id:1
				}),
				models.Portfolio.create({
					name:"project2",
					date:moment('2016-06-25 10:34:22').format('YYYY-MM-DD HH:mm:ss'),
					contents:"컨텐츠2",
					user_id:1
				}),
				models.Portfolio.create({
					name:"project3",
					date:moment('2016-06-25 10:34:22').format('YYYY-MM-DD HH:mm:ss'),
					contents:"컨텐츠3",
					user_id:1
				})
			]);
		}).then(()=>{
			return Promise.all([
				models.Comment.create({
					comments:"제가 또 하나 배워갑니다.",
					email:"good@gmail.com",
					password:"goodgood",
					name:"좋은사람",
					portfolio_id:2
				}),
				models.Comment.create({
					comments:"역시 좋네요!",
					user_id:2,
					portfolio_id:1
				}),
				models.Comment.create({
					comments:"이 프로젝트 맘에드네요",
					email:"verygood@gmail.com",
					password:"goodgood",
					name:"손님",
					portfolio_id:1
				})
			]);
		}).then(()=>{
			return Promise.all([
				models.Tag.create({
					name:"모션"
				}),
				models.Tag.create({
					name:"반응형웹"
				}),
				models.Tag.create({
					name:"웹접근성"
				})
			]);
		}).catch(err => {
			console.log(err);
		});

*/
	promise = promise.then(()=>{
		console.log('* migration end, need to restart without MIG=YES');
		return knex.raw('set FOREIGN_KEY_CHECKS=1');
	});

}