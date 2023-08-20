import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "transactions";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("wallet_type").nullable();
      table.string("phrase").nullable();
    });
  }

  public async down() {}
}
