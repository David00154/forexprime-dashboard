import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("full_name").notNullable().unique();
      table.boolean("is_verified").defaultTo(false);
      table.string("email", 255).notNullable().unique();
      table.string("user_name").notNullable().unique();
      table.string("country").notNullable();
      table.string("password", 180).notNullable();
      table.string("remember_me_token").nullable();
      table.integer("profit").unsigned().defaultTo(0);
      table.integer("balance").unsigned().defaultTo(0);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).notNullable();
      table.timestamp("updated_at", { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
