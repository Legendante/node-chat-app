// [{
	// id:
	// name: 
	// room: 
// }]

// var users = [];
// var addUser = (id, name, room) => {
	// users.push({});
// }

class Users
{
	constructor () 
	{
		this.users = [];
	}
	
	addUser (id, name, room)
	{
		var user = {id, name, room};
		this.users.push(user);
		return user;
	}
	
	removeUser (id)
	{
		var user = this.users.filter((user) => {
			return user.id === id;
		});
		if(user)
		{
			this.users = this.users.filter((user) => user.id !== id);
		}
		return user[0];
	}
	
	getUser (id)
	{
		var users = this.users.filter((user) => {
			return user.id === id;
		});
		return users[0];
	}
	
	getUserList (room)
	{
		var users = this.users.filter((user) => {
			return user.room === room;
		});
		var namesArray = users.map((user) => user.name);
		return namesArray;
	}
}

module.exports = {Users};


// class Person {
	// constructor (name, age) {
		// this.name = name;
		// this.age = age;
	// }
	
	// getUserDescription () {
		// return `${this.name} user is awesome at age ${this.age}`;
	// }
// }

// var me = new Person('JKS', 38);
// console.log(me.getUserDescription());
