// Testing

import * as mysql from "mysql2/promise";

/**
 * Raw pool object from mysql2.
*/
let pool: mysql.Pool;

/**
 * Creates the exported pool using opts.
*/
function initPool(options: mysql.PoolOptions) {
  pool = mysql.createPool(options);
}

/**
 * Returns the raw pool.
*/
function getPool() {
  return pool;
}

/**
 * pool.end()
*/
async function closePool() {
  return pool.end();
}

/**
 * Uses execute internally, which can be prepared and cached.
 * Use for queries that return multiple rows, like SELECT statements.
*/
async function execFetch(options: mysql.QueryOptions) {
  const result = await pool.execute(options);
  return {
    rows: <mysql.RowDataPacket[]>result[0],
    info: <mysql.FieldPacket[]>result[1],
  };
}

/**
 * Uses execute internally, which can be prepared and cached.
 * Use for queries that return a single row, like SELECT LIMIT or WHERE primary key = x statements.
*/
async function execFetchOne(options: mysql.QueryOptions) {
  const result = await pool.execute(options);
  const rows = <mysql.RowDataPacket[]>result[0];
  return {
    row: rows.length > 0 ? rows[0] : null,
    info: <mysql.FieldPacket[]>result[1],
  };
}

/**
 * Runs a query.
 * Use for queries that return multiple rows, like SELECT statements.
*/
async function queryFetch(options: mysql.QueryOptions) {
  const result = await pool.query(options);
  return {
    rows: <mysql.RowDataPacket[]>result[0],
    info: <mysql.FieldPacket[]>result[1],
  };
}

/**
 * Runs a query.
 * Use for queries that return a single row, like SELECT LIMIT or WHERE primary key = x statements.
*/
async function queryFetchOne(options: mysql.QueryOptions) {
  const result = await pool.query(options);
  const rows = <mysql.RowDataPacket[]>result[0];
  return {
    row: rows.length > 0 ? rows[0] : null,
    info: <mysql.FieldPacket[]>result[1],
  };
}

/**
 * Runs a query. Returns no rows, use for statements like INSERT or UPDATE.
*/
async function run(options: mysql.QueryOptions) {
  const result = await pool.query(options);
  return {
    ok: <mysql.OkPacket>result[0],
  };
}

export default {
  initPool,
  closePool,
  getPool,
  execFetch,
  execFetchOne,
  queryFetch,
  queryFetchOne,
  run,
};
