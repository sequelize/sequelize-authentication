# sequelize-authentication

A connect module for authentication against a database.

## Build status

The automated tests we talk about just so much are running on
[Travis public CI](http://travis-ci.org), here is its status:

[![Build Status](https://secure.travis-ci.org/sequelize/sequelize-authentication.png)](http://travis-ci.org/sequelize/sequelize-authentication)

## Usage:

```js
var app            = express()
  , authentication = require('sequelize-authentication')
  , Sequelize      = require('sequelize')
  , sequelize      = new Sequelize('database', 'user', 'password')

app.configure(function() {
  app.use(authentication(sequelize[, options]))
})
```

Note: If you are serving static files (e.g. via `express.static`), make sure, that authentication is added afterwards.

## Options

The second parameter of the `authentication` function is an object with options.

### via

You can define, where the module will find the credentials.

#### Credentials in the URL

```js
authentication(sequelize, { via: 'query' })
```

```console
curl "http://localhost?user=username&password=password"
```

#### Credentials in the post body

```js
authentication(sequelize, { via: 'body' })
```

```console
curl -d "user=username&password=password" http://localhost
```

#### Credentials in the params

```js
authentication(sequelize, { via: 'params' })
```

```console
# works for params in the query
curl "http://localhost?user=username&password=password"

# and for params in the post body
curl -d "user=username&password=password" http://localhost
```

#### Credentials in the headers

```js
authentication(sequelize, { via: 'headers' })
```

```console
curl -d "user=username&password=password" http://localhost
```

## Hm? So, what's next?

Each request to your server will check

## License
Hereby placed under MIT license.
