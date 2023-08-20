import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

import Wallet from "App/Models/Wallet";

export default class WalletController {
  public async show({ auth, view }: HttpContextContract) {
    const wallets = await Wallet.query();
    let newWallets: any = [];
    wallets.map((v) => newWallets.push((v as Wallet).toJSON()));
    return view.render("admin/wallets", {
      ...auth.user?.toJSON(),
      wallets: newWallets,
    });
  }
  public async create({
    auth,
    request,
    response,
    session,
  }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          wallet_name: schema.string([rules.trim()]),
          wallet_address: schema.string([rules.trim()]),
        }),
        messages: {
          "wallet_address.required": "The Wallet address field is required.",
          "wallet_name.required": "The Wallet name field is required.",
        },
      });
      await Wallet.create({
        walletAddress: payload.wallet_address,
        walletName: payload.wallet_name,
      });
      session.flash("form.success", "Wallet created successfully");
      return response.redirect().toRoute("wallets.show");
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
  public async delete({
    auth,
    request,
    response,
    params,
    session,
  }: HttpContextContract) {
    try {
      const id = params.id;
      await Wallet.query().where("id", parseInt(id)).delete();
      session.flash("form.success", "Wallet delete successfull");
      return response.redirect().toRoute("wallets.show");
    } catch (error) {
      session.flash("form.error", "Internal Server Error");
      console.log(error);
      response.redirect().back();
    }
  }
}
