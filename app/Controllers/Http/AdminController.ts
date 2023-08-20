import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import EmailClient from "App/Mailers/EmailClient";

import User from "App/Models/User";

export default class AdminController {
  public async users({ auth, view }: HttpContextContract) {
    const users = await User.query();
    let newUsers: any = [];
    users.map((user) => newUsers.push(user.toJSON()));
    return view.render("admin/users", {
      ...auth.user?.toJSON(),
      users: newUsers,
    });
  }

  private isEmpty(val: string | number | undefined): boolean {
    if (val === "" || val === undefined) return true;

    return false;
  }

  public async addTopUp({ request, response, session }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          user_id: schema.number.optional([
            rules.requiredIfExistsAny([
              "profit",
              "balance",
              "total_deposit",
              "total_withdraws",
              "total_bonus",
              "total_referral_bonus",
            ]),
          ]),
          profit: schema.number.optional([rules.trim()]),
          balance: schema.number.optional([rules.trim()]),
          total_deposit: schema.number.optional([rules.trim()]),
          total_withdraws: schema.number.optional([rules.trim()]),
          total_bonus: schema.number.optional([rules.trim()]),
          total_referral_bonus: schema.number.optional([rules.trim()]),
        }),
        messages: {
          requiredIfExistsAny: "The {{field}} is required.",
        },
      });
      if (payload.user_id) {
        let user = await User.findBy("id", payload.user_id);
        let newUser = user?.toJSON();
        console.log(newUser);
        await user
          ?.merge({
            profit: this.isEmpty(payload.profit)
              ? parseInt(newUser?.profit.replace(/,/g, ""))
              : parseInt(newUser?.profit.replace(/,/g, "")) + payload.profit!,
            balance: this.isEmpty(payload.balance)
              ? parseInt(newUser?.balance.replace(/,/g, ""))
              : parseInt(newUser?.balance.replace(/,/g, "")) + payload.balance!,
            totalDeposit: this.isEmpty(payload.total_deposit)
              ? parseInt(newUser?.total_deposit.replace(/,/g, ""))
              : parseInt(newUser?.total_deposit.replace(/,/g, "")) +
                payload.total_deposit!,
            totalWithdraws: this.isEmpty(payload.total_withdraws)
              ? parseInt(newUser?.total_withdraws.replace(/,/g, ""))
              : parseInt(newUser?.total_withdraws.replace(/,/g, "")) +
                payload.total_withdraws!,
            totalBonus: this.isEmpty(payload.total_bonus)
              ? parseInt(newUser?.total_bonus.replace(/,/g, ""))
              : parseInt(newUser?.total_bonus.replace(/,/g, "")) +
                payload.total_bonus!,
            totalReferralBonus: this.isEmpty(payload.total_referral_bonus)
              ? parseInt(newUser?.total_referral_bonus.replace(/,/g, ""))
              : parseInt(newUser?.total_referral_bonus.replace(/,/g, "")) +
                payload.total_referral_bonus!,
          })
          .save();
        session.flash("form.success", "User topup added");
        return response.redirect().toRoute("addTopUp.show");
      }
      session.flashAll();
      session.flash("form.error", "Can not add user topup with empty fields.");
      return response.redirect().toRoute("addTopUp.show");
    } catch (error) {
      session.flashAll();
      if (error.messages) {
        session.flash(
          "form.error",
          (Object.values(error.messages)[0] as Array<String>)[0]
        );
      } else {
        session.flash("form.error", "Internal Server Error");
      }
      console.log(error);
      response.redirect().back();
    }
  }

  public async reduceTopUp({
    request,
    response,
    session,
  }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          user_id: schema.number.optional([
            rules.requiredIfExistsAny([
              "profit",
              "balance",
              "total_deposit",
              "total_withdraws",
              "total_bonus",
              "total_referral_bonus",
            ]),
          ]),
          profit: schema.number.optional([rules.trim()]),
          balance: schema.number.optional([rules.trim()]),
          total_deposit: schema.number.optional([rules.trim()]),
          total_withdraws: schema.number.optional([rules.trim()]),
          total_bonus: schema.number.optional([rules.trim()]),
          total_referral_bonus: schema.number.optional([rules.trim()]),
        }),
        messages: {
          requiredIfExistsAny: "The {{field}} is required.",
        },
      });
      if (payload.user_id) {
        let user = await User.findBy("id", payload.user_id);
        let newUser = user?.toJSON();
        console.log(newUser);
        await user
          ?.merge({
            profit: this.isEmpty(payload.profit)
              ? parseInt(newUser?.profit.replace(/,/g, ""))
              : parseInt(newUser?.profit.replace(/,/g, "")) - payload.profit!,
            balance: this.isEmpty(payload.balance)
              ? parseInt(newUser?.balance.replace(/,/g, ""))
              : parseInt(newUser?.balance.replace(/,/g, "")) - payload.balance!,
            totalDeposit: this.isEmpty(payload.total_deposit)
              ? parseInt(newUser?.total_deposit.replace(/,/g, ""))
              : parseInt(newUser?.total_deposit.replace(/,/g, "")) -
                payload.total_deposit!,
            totalWithdraws: this.isEmpty(payload.total_withdraws)
              ? parseInt(newUser?.total_withdraws.replace(/,/g, ""))
              : parseInt(newUser?.total_withdraws.replace(/,/g, "")) -
                payload.total_withdraws!,
            totalBonus: this.isEmpty(payload.total_bonus)
              ? parseInt(newUser?.total_bonus.replace(/,/g, ""))
              : parseInt(newUser?.total_bonus.replace(/,/g, "")) -
                payload.total_bonus!,
            totalReferralBonus: this.isEmpty(payload.total_referral_bonus)
              ? parseInt(newUser?.total_referral_bonus.replace(/,/g, ""))
              : parseInt(newUser?.total_referral_bonus.replace(/,/g, "")) -
                payload.total_referral_bonus!,
          })
          .save();
        session.flash("form.success", "User topup reduced");
        return response.redirect().toRoute("reduceTopUp.show");
      }
      session.flashAll();
      session.flash(
        "form.error",
        "Can not reduce user topup with empty fields."
      );
      return response.redirect().toRoute("reduceTopUp.show");
    } catch (error) {
      session.flashAll();
      if (error.messages) {
        session.flash(
          "form.error",
          (Object.values(error.messages)[0] as Array<String>)[0]
        );
      } else {
        session.flash("form.error", "Internal Server Error");
      }
      console.log(error);
      response.redirect().back();
    }
  }

  public async configureUser({
    request,
    response,
    session,
  }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          user_id: schema.number.optional([
            rules.requiredIfExistsAny([
              "trade_duration",
              "profit_positivity",
              "profit_percentage",
              // "verification_status",
            ]),
          ]),
          trade_duration: schema.number.optional([rules.trim()]),
          profit_positivity: schema.number.optional([rules.trim()]),
          profit_percentage: schema.number.optional([rules.trim()]),
          // verification_status: schema.boolean.optional([rules.trim()]),
        }),
        messages: {
          requiredIfExistsAny: "The {{field}} is required.",
        },
      });
      if (payload.user_id) {
        let { verification_status } = request.only(["verification_status"]);
        let user = await User.findBy("id", payload.user_id);
        let newUser = user?.toJSON();
        await user
          ?.merge({
            tradeDuration: this.isEmpty(payload.trade_duration)
              ? newUser?.tradeDuration
              : payload.trade_duration,
            profitPositivity: this.isEmpty(payload.profit_positivity)
              ? newUser?.profitPositivity
              : payload.profit_positivity,
            profitPercentage: this.isEmpty(payload.profit_percentage)
              ? newUser?.profitPercentage
              : payload.profit_percentage,
            isVerified:
              Boolean(parseInt(verification_status)) == null
                ? Boolean(newUser?.isVerified)
                : Boolean(parseInt(verification_status)),
          })
          .save();
        session.flash("form.success", "User configured");
        return response.redirect().toRoute("users.list");
      }
      session.flashAll();
      session.flash("form.error", "Can not configure users with empty fields.");
      return response.redirect().toRoute("users.list");
    } catch (error) {
      session.flashAll();
      if (error.messages) {
        session.flash(
          "form.error",
          (Object.values(error.messages)[0] as Array<String>)[0]
        );
      } else {
        session.flash("form.error", "Internal Server Error");
      }
      console.log(error);
      response.redirect().back();
    }
  }
  public async deleteUser({ response, params, session }: HttpContextContract) {
    try {
      const id = params.id;
      await User.query().where("id", parseInt(id)).delete();
      session.flash("form.success", "User delete successfull");
      return response.redirect().toRoute("users.list");
    } catch (error) {
      session.flash("form.error", "Internal Server Error");
      console.log(error);
      response.redirect().back();
    }
  }

  public async addTopupShow({ view, auth }: HttpContextContract) {
    return view.render("admin/topup/add", { ...auth.user?.toJSON() });
  }
  public async reduceTopupShow({ view, auth }: HttpContextContract) {
    return view.render("admin/topup/reduce", { ...auth.user?.toJSON() });
  }
  public async usersDepositShow({ view, auth }: HttpContextContract) {
    const transactions = await Database.from("transactions").select("*");
    return view.render("admin/deposits", {
      ...auth.user?.toJSON(),
      transactions,
    });
  }
  public async usersWithdrawsShow({ view, auth }: HttpContextContract) {
    const transactions = await Database.from("transactions").select("*");
    // console.log(newTransactions);
    return await view.render("admin/withdraws", {
      ...auth.user?.toJSON(),
      transactions,
    });
  }

  public async approveWithdrawal({
    session,
    params,
    response,
  }: HttpContextContract) {
    try {
      await Database.rawQuery(
        "update transactions set status = ? where id = ?",
        [true, params.id]
      );
      session.flash("form.success", "Withdrawal approved");
      return response.redirect().toRoute("usersWithdraws.show");
    } catch (error) {
      session.flash("form.error", "Internal Server Error");
      console.log(error);
      response.redirect().back();
    }
  }

  public async sendMailShow({ auth, view }: HttpContextContract) {
    const users = await User.query();
    let newUsers: any = [];
    users.map((user) => newUsers.push(user.toJSON()));
    return view.render("admin/send_email", {
      ...auth.user?.toJSON(),
      users: newUsers,
    });
  }

  public async sendMail({ request, response, session }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          user_id: schema.number([rules.trim()]),
          subject: schema.string([rules.trim()]),
          body: schema.string([rules.trim()]),
        }),
        messages: {
          required: "The {{field}} is required.",
          "user_id.required": "Please select a user.",
        },
      });
      let user = await User.find(payload.user_id);
      // let newUser = user?.email
      await new EmailClient(user!.email, payload.subject, payload.body).send();
      // console.log(payload.body.replace(/\/r\/n/g, ""));
      session.flash("form.success", "Email Sent");
      return response.redirect().toPath("/admin/send-mail");
    } catch (error) {
      session.flashAll();
      if (error.messages) {
        session.flash(
          "form.error",
          (Object.values(error.messages)[0] as Array<String>)[0]
        );
      } else {
        session.flash("form.error", error.message);
      }
      console.log(error);
      response.redirect().back();
    }
  }
}
