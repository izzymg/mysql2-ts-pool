import * as sql from "."
import { strict as assert } from "assert"
import * as mysql from "mysql2/promise";

async function test() {

  console.log("Dropping table dogs_test");
  await sql.run({
    sql: "DROP TABLE IF EXISTS dogs_test",
  });

  console.log("Creating table dogs_test");
  await sql.run({
    sql: "CREATE TABLE dogs_test \
     (id integer auto_increment primary key, name text)\
     ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  });

  console.log("Inserting 3 dogs using Promise.all");
  const dogs = [ "becky", "lizzy", "shifty" ];
  await Promise.all(dogs.map(dog => {
    sql.run({ sql: `INSERT INTO dogs_test SET name = ?`, values: [dog] })
  }));

  const { rows: fetchRows, info: fetchInfo, } = await sql.execFetch({
    sql: "SELECT * FROM dogs_test",
  });

  console.log("Asserting execFetch() results are correct");
  assert(typeof fetchRows.length == "number", "execFetch() failed to return array of rows.");
  assert(dogs.includes(fetchRows[0].name), "execFetch() rows don't contain an expected property.");
  assert(typeof fetchInfo.length == "number", "execFetch() failed to return array of field packets.")

  const { row: fetchOneRow, info: fetchOneInfo, } = await sql.execFetchOne({
    sql: "SELECT * FROM dogs_test WHERE id = 1",
  });

  console.log("Asserting execFetchOne() results are correct");
  assert(fetchOneRow, "Expected execFetchOne() to return a single row.");
  assert(dogs.includes(fetchOneRow.name), "execFetchOne() row didn't contain expected row property.");
  assert(typeof fetchOneInfo.length == "number", "execFetchOne() failed to return array of field packets.")


  const { ok: runOk, } = await sql.run({
    sql: "UPDATE dogs_test SET name = ? WHERE id = 3",
    values: ["cutie"]
  });

  console.log("Asserting run() results are correct");
  assert(typeof runOk.affectedRows == "number", "Expected run to return object with affectedRows property.");

  const { row: queryOneRow, info: queryOneInfo } = await sql.queryFetchOne({
    sql: "SELECT * FROM dogs_test WHERE name = ?",
    values: ["cutie"]
  });

  console.log("Asserting queryFetchOne() results are correct");
  assert(queryOneRow.name == "cutie" && queryOneRow.id == 3, "Expected queryOneRow() to return last updated row.");
  assert(typeof queryOneInfo.length == "number", "queryOneRow() failed to return array of field packets.")

  const { row: nullData } = await sql.queryFetchOne({ sql: "SELECT * FROM dogs_test WHERE id = 100" });
  assert(nullData == null, "Expected queryFetchOne() to return null");

  let runErr: mysql.QueryError;

  try {
    await sql.run({ sql: "SELEC * from fff" });
  } catch(error) {
    runErr = error;
  }

  console.log("Asserting failed query throws an error");
  assert(runErr, "Expected error thrown from invalid SQL query");
  assert(runErr.code == "ER_PARSE_ERROR", "Expected error code ER_PARSE_ERROR");
  console.log("Got error successfully, code:", runErr.code);
};

(async() => {
  const uri = process.argv[2];
  if(!uri) {
    console.error("Expected mysql connection URI as first arg");
    process.exit(0);
  }

  sql.initPool({ uri, });

  try {
    await test();
    console.log("Tests completed");
  } catch(error) {
    console.error(error);
    process.exit(1);
  } finally {
    await sql.closePool();
  }
})();