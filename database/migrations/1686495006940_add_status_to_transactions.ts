import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "transactions";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean("status").defaultTo(false);
    });
  }

  public async down() {}
}
