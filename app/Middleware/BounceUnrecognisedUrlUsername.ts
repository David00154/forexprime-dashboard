import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BounceUnrecognisedUrlUsername {
  public async handle(
    { response, auth, params }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    // console.log(params);
    if (auth.isLoggedIn && params.username !== auth.user?.userName) {
      await auth.logout();
      return response.status(302).redirect().toRoute("login.show");
    }
    await next();
  }
}
