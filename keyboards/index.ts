import { InlineKeyboard, InputFile, Keyboard } from "grammy";
import { Menu, MenuRange } from "grammy/menu";
import {
  CafeListResponseType,
  EmployeeType,
  MyContext,
  ROLE_MAPPING,
  UserRole,
} from "types";
import { decodeBase64 } from "jsr:@std/encoding/base64";
import { qrcode } from "qrcode";

export const menuKeyboard = new Keyboard()
  .text("Создать кафе").row()
  .text("Список моих кафе").row()
  .resized();

export const cancelMenu = new Keyboard()
  .text("Отмена").row();

export const onboardingMenu = new Menu<MyContext>("onboarding")
  .text("Создать кафе", async (ctx) => {
    await ctx.conversation.enter("createCafeConversation");
  }).row();

export const editCafeMenu = new Menu<MyContext>("edit-cafe")
  .text(
    "Создать новую рассылку",
    (ctx) => ctx.conversation.enter("createNewsletterConversation"),
  ).row()
  .text(
    "QR code",
    async (ctx) => {
      const qr = await qrcode(
        `${
          Deno.env.get("MORDA_ADDRESS")
        }?startapp=${ctx.session.currentCafe?.cafeId}`,
      );
      const res = new InputFile(decodeBase64(qr.split(",")[1]));
      await ctx.replyWithPhoto(res);
    },
  ).row()
  .submenu("Сотрудники", "cafe-employees").row()
  .text(
    "Изменить название кафе",
    (ctx) => ctx.conversation.enter("editCafeNameConversation"),
  ).row()
  .text(
    "Изменить кол-во покупок",
    (ctx) => ctx.conversation.enter("editCafePurchaseCountConversation"),
  ).row()
  .text(
    "Удалить кафе",
    (ctx) => ctx.conversation.enter("deleteCafeConversation"),
  ).row();

export const editEmployeeMenu = new Menu<MyContext>("edit-employee")
  .text(
    "Удалить",
    (ctx) => ctx.conversation.enter("deleteEmployeeConversation"),
  ).row()
  .text(
    "Отмена",
    async (ctx) => {
      ctx.session.currentUser = undefined;
      await ctx.reply("Список Ваших кафе:", { reply_markup: cafeListKeyboard });
    },
  )
  .row();

export const employeeRoleMenu = new InlineKeyboard()
  .text("Администратор", UserRole.Admin).row()
  .text("Сотрудник", UserRole.Employee).row();

export const cafeListKeyboard = new Menu<MyContext>("cafe-list");
cafeListKeyboard.dynamic((ctx) => {
  const range = new MenuRange<MyContext>();
  for (let i = 0; i < ctx.session.cafeList.length; i++) {
    range
      .text(
        ctx.session.cafeList[i].cafeName,
        (ctx) => handleEditCafe(ctx, ctx.session.cafeList[i]),
      )
      .row();
  }
  return range;
});

export const cafeEmployeesKeyboard = new Menu<MyContext>("cafe-employees")
  .text("Новый сотрудник", async (ctx) => {
    await ctx.conversation.enter("createEmployeeConversation");
  }).row();
cafeEmployeesKeyboard.dynamic((ctx) => {
  const range = new MenuRange<MyContext>();
  for (let i = 0; i < ctx.session.currentCafe!.employees.length; i++) {
    range
      .text(
        `${
          ctx.session.currentCafe!.employees[i].employeeName ||
          ctx.session.currentCafe!.employees[i].tgId.toString()
        } - ${ROLE_MAPPING[ctx.session.currentCafe!.employees[i].role]}`,
        (ctx) => handleEditEmployee(ctx, ctx.session.currentCafe!.employees[i]),
      )
      .row();
  }
  return range;
});

async function handleEditEmployee(ctx: MyContext, employeeData: EmployeeType) {
  const cafeData = ctx.session.currentCafe!;
  ctx.session.currentUser = employeeData;

  await ctx.reply(
    `Название кафе: ${cafeData.cafeName}\n Сотрудник: ${employeeData.tgId}`,
    { reply_markup: editEmployeeMenu },
  );
}

async function handleEditCafe(ctx: MyContext, cafeData: CafeListResponseType) {
  ctx.session.currentCafe = cafeData;
  await ctx.reply(
    `Название кафе: ${cafeData.cafeName}\nПокупок, необходимых для подарка: ${cafeData.purchaseCount}`,
    { reply_markup: editCafeMenu },
  );
  // await ctx.editMessageReplyMarkup()
}
