import type { PGlite } from "@electric-sql/pglite";
import { CompiledQuery,type DatabaseConnection,type DatabaseIntrospector,type Dialect,type Driver,type Kysely,PostgresAdapter,PostgresIntrospector,PostgresQueryCompiler,type QueryCompiler,type QueryResult,type TransactionSettings } from "kysely";
export function pgliteDialect(getClient:()=>Promise<PGlite>|PGlite):Dialect {
 return {createAdapter:()=>new PostgresAdapter(),createDriver:()=>new LazyDriver(getClient),createQueryCompiler:():QueryCompiler=>new PostgresQueryCompiler(),createIntrospector:(db:Kysely<unknown>):DatabaseIntrospector=>new PostgresIntrospector(db)};
}
class LazyDriver implements Driver {
 private client?:PGlite; private busy=false; private waiters:Array<()=>void>=[];
 constructor(private getClient:()=>Promise<PGlite>|PGlite){}
 async init(){this.client=await this.getClient();}
 async acquireConnection():Promise<DatabaseConnection>{
  this.client??=await this.getClient();
  if(this.busy)await new Promise<void>(resolve=>this.waiters.push(resolve));
  this.busy=true;return new Conn(this.client,()=>{this.busy=false;this.waiters.shift()?.();});
 }
 async releaseConnection(conn:DatabaseConnection){(conn as Conn).release();}
 async beginTransaction(conn:DatabaseConnection,settings:TransactionSettings){await (conn as Conn).query(settings.isolationLevel?CompiledQuery.raw("start transaction isolation level "+settings.isolationLevel):CompiledQuery.raw("begin"));}
 async commitTransaction(conn:DatabaseConnection){await (conn as Conn).query(CompiledQuery.raw("commit"));}
 async rollbackTransaction(conn:DatabaseConnection){await (conn as Conn).query(CompiledQuery.raw("rollback"));}
 async destroy(){this.client=undefined;}
}
class Conn implements DatabaseConnection {
 constructor(private client:PGlite,private done:()=>void){}
 release(){this.done();}
 async query<O>(q:CompiledQuery):Promise<QueryResult<O>>{const r=await this.client.query(q.sql,[...q.parameters]);return {rows:r.rows as O[],...(r.affectedRows?{numAffectedRows:BigInt(r.affectedRows)}:{})};}
 async executeQuery<O>(q:CompiledQuery){return this.query<O>(q);}
 async *streamQuery<O>(q:CompiledQuery,size:number):AsyncIterableIterator<QueryResult<O>>{if(size<=0)throw new Error("chunk size must be positive");const r=await this.client.query(q.sql,[...q.parameters]);for(let i=0;i<r.rows.length;i+=size)yield {rows:r.rows.slice(i,i+size) as O[]};}
}
