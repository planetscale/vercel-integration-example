
# Vercel + Planetscale
A [next.js](https://nextjs.org/) app deployed to [vercel](https://vercel.com) with a [planetscale](https://planetscale.com) integration. This example app uses the [planetscale-node](https://github.com/planetscale/planetscale-node) client to query the database

## Setup database
- Install [Planetscale CLI](https://planetscale.com/cli)
- Authenticate the CLI
```sh
pscale auth login
```
- Create a new database
```sh
pscale database create <db-name>
```
- Create a new branch
```sh
pscale branch create <db-name> <branch-name>
```
- Connect to your branch
```sh
pscale shell <db-name> <branch-name>
```
- Insert example tables
```sql
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  name varchar(255)
);
```
- Head over to your planetscale dashboard and create a new deploy request with `<branch-name>`

## Clone & Deploy to vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fplanetscale%2Fvercel-integration-example&project-name=planetscale-next-js&repository-name=planetscale-next-js&integration-ids=oac_ni8CGiTU3oM25q1k2L6unVMp)


- The integration will automatically add the following environment variables to your Vercel project(s)
  - `PLANETSCALE_DB`
  - `PLANETSCALE_ORG`
  - `PLANETSCALE_TOKEN`
  - `PLANETSCALE_TOKEN_NAME`

_These environment variables are used by [planetscale-node](https://github.com/planetscale/planetscale-node) client to connect to your database_
- Re-deploy your application after the installation is complete and you will have a working app.
