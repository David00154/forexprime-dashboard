import { BaseMailer, MessageContract } from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import env from "@ioc:Adonis/Core/Env";

export default class DepositAlert extends BaseMailer {
  constructor(
    private user: User,
    private amount: number,
    private coin: string,
    private address: string,
    private date: string,
  ) {
    super();
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "DepositAlert.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message
      .subject("User made deposit")
      .from(env.get("SMTP_USERNAME"))
      .to(env.get("SMTP_USERNAME"))
      .htmlView("emails/deposit", {
        email: this.user.email,
        amount: this.amount,
        name: this.user.fullName,
        coin: this.coin,
        address: this.address,
        date: this.date,
        // subject: this.subject,
        // body: this.body
        //   .split("\r\n")
        //   .map((text) => {
        //     if (text == "") {
        //       return `<br>`;
        //     } else {
        //       return `<p>${text}</p>`;
        //     }
        //   })
        //   .join(""),
      });
  }
}
