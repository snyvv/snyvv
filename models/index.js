var path = require('path');
var config = require('../config');

// 어플리케이션 처음에 DB에 연결하고 BookShelf 객체를 돌려주는 곳이 필요
var knex = require('knex')({
	client: 'mysql',
	connection: {
		host     : '127.0.0.1',
		user     : config.username,
		password : config.password,
		database : config.database,
		charset  : 'utf8'
  }
});
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
			.dropTableIfExists('comments')
			.dropTableIfExists('tags')
			// 테이블생성
			.createTable('users', (table) => {
				table.increments('id').primary();
				table.string('uid').notNullable().unique();
				table.string('name').notNullable().unique();
				table.string('password').notNullable();
				table.string('email').notNullable();
				table.timestamps();
			})
			.createTable('portfolios', (table) => {
				table.increments('id').primary();
				table.string('name').notNullable();
				table.datetime('date').notNullable();
				table.integer('user_id').unsigned().references('users.id').notNullable(); // forign key for users
				table.timestamps();
			})
			.createTable('comments', (table) => {
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
				table.increments('id').primary();
				table.string('name');
			})
			.createTable('portfolio_tags', (table) => { // pebut table
				table.integer('portfolio_id').unsigned().references('portfolios.id').notNullable();
				table.integer('tag_id').unsigned().references('tags.id').notNullable();
			})
			.then(() => {
				console.log('* Create Table Complete===');
			});
		});

	promise = promise.then(()=>{
		console.log('* migration end, need to restart without MIG=YES');
		return knex.raw('set FOREIGN_KEY_CHECKS=1');
	});

}