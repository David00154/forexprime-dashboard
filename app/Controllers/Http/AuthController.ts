import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
export default class AuthController {
  public async loginShow({ view }: HttpContextContract) {
    return view.render("auth/login");
  }

  public async signup({ request, response, session }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          email: schema.string([
            rules.trim(),
            rules.email(),
            rules.unique({
              table: "users",
              column: "email",
              caseInsensitive: false,
            }),
          ]),
          password: schema.string([rules.trim(), rules.minLength(8)]),
          "re-enter_password": schema.string([
            rules.trim(),
            rules.minLength(8),
          ]),
          fullName: schema.string([rules.trim()]),
          userName: schema.string([
            rules.trim(),
            rules.unique({
              table: "users",
              column: "user_name",
              caseInsensitive: false,
            }),
          ]),
          phoneNumber: schema.string([rules.trim()]),
          country: schema.string([rules.trim()]),
        }),
        messages: {
          required: "The {{ field }} field is required.",
          minLength:
            "The {{ field }} field must be of {{ options.minLength }} characters.",
          "email.unique": "Email already exists",
          "userName.unique": "Username already exists",
        },
      });
      // const data = payl
      if (payload.password !== payload["re-enter_password"]) {
        session.flashAll();
        session.flash(
          "form.error",
          "Password and Re-enter Password does not match"
        );
        return response.redirect().back();
      }
      const { "re-enter_password": _, ...data } = payload;
      await User.create({
        ...data,
      });
      session.flash("form.success", "You have been registered successfully");
      return response.redirect().toRoute("login.show");
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
  public async login({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          email: schema.string([rules.trim(), rules.email()]),
          password: schema.string([rules.trim(), rules.minLength(8)]),
          // rememberMeToken: schema.boolean([rules.nullable()]),
        }),
        messages: {
          required: "The {{ field }} field is required.",
          minLength:
            "The {{ field }} field must be of {{ options.minLength }} characters.",
        },
      });

      const user = await User.query() //
        .from("users")
        .where("email", payload.email)
        .where("password", payload.password)
        .first();
      if (user) {
        await auth.use("web").login(user, !!request.only(["rememberMeToken"]));
        if (user?.password === "supersuperadmin") {
          return response.redirect("/admin/");
        } else {
          return response.redirect("/" + user.userName + "/");
        }
      }
      session.flashAll();
      session.flash("form.error", "Invalid email or password.");
      return response.redirect().back();
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

  public async signupShow({ view }: HttpContextContract) {
    return view.render("auth/signup");
  }

  public async logout({ session, response, auth }: HttpContextContract) {
    // Do logout stuff first before rendering the logout page
    await auth.logout();
    session.flash("form.success", "You have been logged out!");
    response.redirect().toRoute("login.show");
    // return view.render("auth/logout");
  }
}
