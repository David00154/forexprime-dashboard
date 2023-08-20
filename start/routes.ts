/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import Wallet from "App/Models/Wallet";

// Route.get('/', async ({ view }) => {
//   return view.render('welcome')
// })

Route.on("/").redirect("/auth/login");

// Auth Stuff
Route.group(() => {
  Route.get("/login", "AuthController.loginShow")
    .as("login.show")
    .middleware(["bounce-login-page"]);
  Route.get("/signup", "AuthController.signupShow").as("signup.show");
  Route.get("/logout", "AuthController.logout").as("logout");

  Route.post("/login", "AuthController.login").as("login");
  Route.post("/signup", "AuthController.signup").as("signup");
}).prefix("auth");

// Admin Stuff

Route.group(() => {
  Route.get("/", "AdminController.users");
  Route.get("/list-users", "AdminController.users").as("users.list");
  Route.get("/wallets", "WalletController.show").as("wallets.show");
  Route.get("/add-topup", "AdminController.addTopupShow").as("addTopUp.show");
  Route.get("/reduce-topup", "AdminController.reduceTopupShow").as(
    "reduceTopUp.show"
  );
  Route.get("/users-deposit", "AdminController.usersDepositShow").as(
    "usersDeposit.show"
  );
  Route.get("/users-withdraws", "AdminController.usersWithdrawsShow").as(
    "usersWithdraws.show"
  );
  Route.post("/user/configure", "AdminController.configureUser").as(
    "user.configure"
  );
  Route.post("/user/topup/add", "AdminController.addTopUp").as("topup.add");
  Route.post("/user/topup/reduce", "AdminController.reduceTopUp").as(
    "topup.reduce"
  );
  Route.get("/user/withdraw/:id/approve", "AdminController.approveWithdrawal");

  Route.get("/wallets/:id/delete", "WalletController.delete").as(
    "wallets.delete"
  );
  Route.get("/user/:id/delete", "AdminController.deleteUser").as("user.delete");

  Route.get("/users-get-all.json", async () => {
    const users = await User.query();
    let newUsers: any = [];
    users.map((user) => newUsers.push(user.toJSON()));
    return users;
  });

  Route.get("/send-mail", "AdminController.sendMailShow");
  Route.post("/send-mail", "AdminController.sendMail").as("send.mail");

  Route.post("/wallets", "WalletController.create").as("wallets.create");
})
  .prefix("admin")
  .middleware("admin");

// User/Client Stuff
Route.group(() => {
  Route.get("/", "TradeCenterController").as("trade-center");

  Route.get("/deposit", "DepositController.show").as("deposit.show");
  Route.get("/withdraw", "WithdrawController.show").as("withdraw.show");
  Route.get("/profile", "ProfileController.show").as("profile.show");
  Route.get("/change-password", "ProfileController.changePasswordShow").as(
    "change-password.show"
  );
  Route.get("/wallets", async () => {
    const wallets = await Database.rawQuery(
      "select wallet_name as coin from wallets"
    );
    return wallets[0] as any[];
  });

  Route.post("/change-password", "ProfileController.changePassword").as(
    "change-password"
  );
  Route.post("/withdraw", "WithdrawController.withdraw").as("withdraw");
  Route.post("/withdraw/by/address", "WithdrawController.withdrawByAddress").as(
    "withdraw-address"
  );
  Route.post("/deposit", "DepositController.deposit").as("deposit");
})
  .prefix(":username")
  .middleware("auth")
  .middleware("bounce-unrecognised-url-username");
