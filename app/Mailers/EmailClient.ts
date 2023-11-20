import { BaseMailer, MessageContract } from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import env from "@ioc:Adonis/Core/Env";

export default class EmailClient extends BaseMailer {
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  constructor(
    private email: string,
    private subject: string,
    private body: string,
  ) {
    super();
  }

  /**
   * The prepare method is invoked automatically when you run
   * "EmailClient.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message
      .subject(this.subject)
      .from(env.get("SMTP_USERNAME"))
      .to(this.email)
      .htmlView("emails/clientmail", {
        subject: this.subject,
        body: this.body
          .split("\r\n")
          .map((text) => {
            if (text == "") {
              return `<br>`;
            } else {
              return `<p>${text}</p>`;
            }
          })
          .join(""),
      });
  }
}
