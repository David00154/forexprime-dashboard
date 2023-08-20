import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class TradeCenterController {
  public async handle({ view, auth }: HttpContextContract) {
    await auth.user?.load("transactions");
    // console.log(auth.user?.toJSON());
    return view.render("[user_name]/trade_center", { ...auth.user?.toJSON() });
  }
}
