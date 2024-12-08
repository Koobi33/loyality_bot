import { Bot, GrammyError, HttpError, session } from "grammy";
import { conversations, createConversation } from "grammy/conversations";
import { fetchCafeListApiRequest } from "api";
import {
  createCafeConversation,
  createEmployeeConversation,
  deleteCafeConversation,
  deleteEmployeeConversation,
  editCafeNameConversation,
  editCafePurchaseCountConversation,
} from "conversations";
import { CafeListResponseType, SessionData } from "types";

import {
  cafeEmployeesKeyboard,
  cafeListKeyboard,
  editCafeMenu,
  editEmployeeMenu,
  menuKeyboard,
} from "keyboards";
import { bot } from "./adminBot.ts";
import { createNewsletterConversation } from "./conversations/createNewsletterConversation.ts";

function initial(): SessionData {
  return {
    cafeList: [],
    currentCafe: undefined,
    currentUser: undefined,
  };
}

bot.use(session({
  initial,
}));

// CONVERSATIONS
bot.use(conversations());

bot.use(createConversation(createNewsletterConversation));

bot.use(createConversation(createEmployeeConversation));
bot.use(createConversation(deleteEmployeeConversation));

bot.use(createConversation(createCafeConversation));
bot.use(createConversation(editCafeNameConversation));
bot.use(createConversation(editCafePurchaseCountConversation));
bot.use(createConversation(deleteCafeConversation));

// MENUS and KEYBOARDS
bot.use(editEmployeeMenu);

bot.use(editCafeMenu);
bot.use(cafeListKeyboard);

cafeListKeyboard.register(editCafeMenu);
editCafeMenu.register(cafeEmployeesKeyboard);
editEmployeeMenu.register(cafeListKeyboard);

// TODO: /send-notice scenario

// COMMANDS

// START
bot.command(
  "start",
  (ctx) =>
    ctx.reply("Добро пожаловать. Запущен и работает!", {
      reply_markup: menuKeyboard,
    }),
);

// CREATE CAFE
bot.hears("Создать кафе", async (ctx) => {
  await ctx.conversation.enter("createCafeConversation");
});

// CAFE LIST
bot.hears("Список моих кафе", async (ctx) => {
  const data = await fetchCafeListApiRequest({ userTgId: ctx.from?.id! });

  ctx.session.cafeList = data as Array<CafeListResponseType>;

  await ctx.reply("Список Ваших кафе", { reply_markup: cafeListKeyboard });
});

// EMPLOYEE LIST
bot.hears("Сотрудники", async (ctx) => {
  await ctx.editMessageReplyMarkup({ reply_markup: cafeEmployeesKeyboard });
});

// NEW NEWSLETTER
bot.hears(
  "Создать новую рассылку",
  (ctx) => ctx.conversation.enter("createNewsletterConversation"),
);

// Запустите бота.
bot.start();

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
