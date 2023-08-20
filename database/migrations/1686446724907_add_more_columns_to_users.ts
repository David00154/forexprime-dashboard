import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("trade_duration").unsigned().defaultTo(0);
      table.integer("profit_positivity").unsigned().defaultTo(0);
      table.integer("profit_percentage").unsigned().defaultTo(0);
      table.string("valid_thru_day").defaultTo("08");
      table.string("valid_thru_month").defaultTo("08");
    });
  }

  public async down() {}
}
