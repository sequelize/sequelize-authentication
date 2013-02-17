# sequelize-authentication

A connect module for authentication against a database.

## Build status

The automated tests we talk about just so much are running on
[Travis public CI](http://travis-ci.org), here is its status:

[![Build Status](https://secure.travis-ci.org/sequelize/sequelize-authentication.png)](http://travis-ci.org/sequelize/sequelize-authentication)

## Usage

	var app            = express()
	  , authentication = require('sequelize-authentication')
	  , Sequelize      = require('sequelize')
	  , sequelize      = new Sequelize('database', 'user', 'password')
	
	app.configure(function() {
	  // express.static would go here
	  app.use(authentication(sequelize[, options]))
	  // express router would go here
	})

**Note:** If you are serving static files (e.g. via `express.static`), make sure, that authentication is added afterwards.
Also you should make sure, that the router is added after the authentication module.

## Options

The second parameter of the `authentication` function is an object with options. Let's assume an application,
that delivers `hello world` if the a user has authenticated successfully for the following description. You
might want to check the example application under `example/app.js`. My local database has a `root` user 
without password.

### Option: `via`

`via` defines, where the module will find the credentials.

#### Credentials in the params (default)

	authentication(sequelize, { via: 'params' })

This will tell the module, that the credentials are either in the URL of the request or the body (POST).
If you don't want to use headers, this is most likely what you want.

	curl "http://localhost:3000?user=root&password="
	# => hello world

	curl "http://localhost:3000?user=root&password=fnord"
	# => Unauthorized
	
	curl -d "user=root&password=" "http://localhost:3000"
	# => hello world

	curl -d "user=root&password=fnord" "http://localhost:3000"
	# => Unauthorized

#### Credentials in the headers

	authentication(sequelize, { via: 'headers' })

This defines, that the credentials are in the headers of the request.

	curl "http://localhost:3000?user=root&password="
	# => Unauthorized

	curl "http://localhost:3000?user=root&password=fnord"
	# => Unauthorized
	
	curl -d "user=root&password=" "http://localhost:3000"
	# => Unauthorized
	
	curl -d "user=root&password=fnord" "http://localhost:3000"
	# => Unauthorized
	
	curl -H "user: root" -H "password: " http://localhost:3000
	# => hello world
	
	curl -H "user: root" -H "password: fnord" http://localhost:3000
	# => Unauthorized

#### Credentials in the URL

	authentication(sequelize, { via: 'query' })

Credentials are in the URL of the request only.

	curl "http://localhost:3000?user=root&password="
	# => hello world
	
	curl "http://localhost:3000?user=root&password=fnord"
	# => Unauthorized
	
	curl -d "user=root&password=" "http://localhost:3000"
	# => Unauthorized

	curl -d "user=root&password=fnord" "http://localhost:3000"
	# => Unauthorized

#### Credentials in the post body

	authentication(sequelize, { via: 'body' })

Credentials are in the body of the request only.

	curl "http://localhost:3000?user=root&password="
	# => Unauthorized
	
	curl "http://localhost:3000?user=root&password=fnord"
	# => Unauthorized
	
	curl -d "user=root&password=" "http://localhost:3000"
	# => hello world
	
	curl -d "user=root&password=fnord" "http://localhost:3000"
	# => Unauthorized

### Option: `scope`

`scope` defines, which urls should receive protection via the module.

	authentication(sequelize, { scope: '/api' })

This will protect each url that starts with `/api`.

	curl http://localhost:3000
	# => hello world
	
	curl http://localhost:3000/api/secret
	# => Unauthorized

	curl http://localhost:3000/api/secret?user=root&password=
	# => hello world

### Option: `param`

`param` defines a parameter name which scopes the credentials. The default is none.

	authentication(sequelize, { param: 'credentials' })

The module will now check, if the credentials are located in the credentials object.

	curl "http://localhost:3000?credentials\[user\]=root&credentials\[password\]="
	# => hello world

## Hm? So, what's next?

The server will send each request through the authentication module. If the request authenticates correctly, it will be passed to the router. If authentication fails, the module will response with a 401 and the message 'Unauthorized'.

## License
Hereby placed under MIT license.
