// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mysql from 'mysql2'

const {
  PLANETSCALE_DB,
  PLANETSCALE_DB_HOST,
  PLANETSCALE_DB_USERNAME,
  PLANETSCALE_DB_PASSWORD,
  PLANETSCALE_SSL_CERT_PATH
} = process.env

const conn = mysql.createConnection({
  database: PLANETSCALE_DB,
  host: PLANETSCALE_DB_HOST,
  password: PLANETSCALE_DB_PASSWORD,
  ssl: {
    ca: PLANETSCALE_SSL_CERT_PATH
  },
  user: PLANETSCALE_DB_USERNAME
})

export default async (req, res) => {
  const {
    body: { email, name, password },
    method
  } = req
  switch (method) {
    case 'POST':
      const [rows, fields] = await conn.query(
        `insert into users (email, name, password) values ('${email}', '${name}', '${password}')`
      )
      res.statusCode = 201
      res.json({ email, name })
      break
    case 'GET':
      try {
        const [getRows, _] = await conn.query('select * from users')
        res.statusCode = 200
        res.json(getRows)
      } catch (e) {
        error = new Error('An error occurred while connecting to the database')
        error.status = 500
        error.info = { message: 'An error occurred while connecting to the database' }
        throw error
      }

      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
