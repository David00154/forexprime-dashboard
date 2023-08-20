import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BounceLoginPage {
  public async handle(
    { auth, response, request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (await auth.check()) {
      if (auth.user?.password === "supersuperadmin") {
        return response.redirect().toPath("/admin/");
      } else {
        return response
          .redirect()
          .toRoute("trade-center", { username: auth.user?.userName });
      }
    }
    await next();
  }
}
