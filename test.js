const { Client } = require('pg')
const client = new Client({
  host: '35.228.106.158',
  port: 5432,
  user: 'postgres',
  password: 'secretpassword!!',
})