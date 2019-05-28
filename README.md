# mysql2-ts-pool

This is a small TypeScript module that provides the following functions for promise pools.

TODO: finish this readme

##### Mysql2 definitions

* RowDataPacket: Object representing a row returned by the query. Can have any properties.
* FieldPacket: Object containing db metadata.

### `initPool(options: PoolOptions)`

Establishes the exported pool using PoolOptions

### `async closePool()`

Awaits `pool.end()`

### `async execFetch(options: QueryOptions)`

Runs the [execute](https://www.npmjs.com/package/mysql2#using-prepared-statements) function, and returns an array of `RowDataPacket` and an array of `FieldPacket`. 

### `async execFetchOne(options: QueryOptions)`

Runs the execute function, and returns a single `RowDataPacket` and an array of `FieldPacket`. 

### `async queryFetch(options: QueryOptions)`

Runs the query function, and returns an array of `RowDataPacket` and an array of `FieldPacket`. 

### `async queryFetchOne(options: QueryOptions)`

Runs the query function, and returns a single `RowDataPacket` and an array of `FieldPacket`. 

### `async run(options: QueryOptions)`

Runs the query function, and returns a single `OkPacket` 


### `pool`

Raw pool