import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    // this.schema.alterTable(this.tableName, (table) => {
    //   table.dropColumn("phone_number");
    //   table.string("phone_number").notNullable().unique();

    // });
    this.schema.raw(
      "alter table `" +
        this.tableName +
        "` modify column `phone_number` varchar(255) not null"
    );
  }

  public async down() {}
}
