import { GrammyError, HttpError, session } from "grammy";
import { conversations, createConversation } from "grammy/conversations";
import { fetchCafeListApiRequest } from "api";
import {
  createCafeConversation,
  createEmployeeConversation,
  createNewsletterConversation,
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
  onboardingMenu,
} from "keyboards";
import { adminBot } from "./adminBot.ts";
import { hydrateReply } from "grammy/parse-mode";

function initial(): SessionData {
  return {
    cafeList: [],
    currentCafe: undefined,
    currentUser: undefined,
  };
}

adminBot.use(session({
  initial,
}));
adminBot.use(hydrateReply);

// CONVERSATIONS
adminBot.use(conversations());

adminBot.use(createConversation(createNewsletterConversation));

adminBot.use(createConversation(createEmployeeConversation));
adminBot.use(createConversation(deleteEmployeeConversation));

adminBot.use(createConversation(createCafeConversation));
adminBot.use(createConversation(editCafeNameConversation));
adminBot.use(createConversation(editCafePurchaseCountConversation));
adminBot.use(createConversation(deleteCafeConversation));

// MENUS and KEYBOARDS
adminBot.use(onboardingMenu);

adminBot.use(editEmployeeMenu);

adminBot.use(editCafeMenu);
adminBot.use(cafeListKeyboard);

cafeListKeyboard.register(editCafeMenu);
editCafeMenu.register(cafeEmployeesKeyboard);
editEmployeeMenu.register(cafeListKeyboard);

//TODO: -имена новых сотрудников

// COMMANDS

// START
adminBot.command(
  "start",
  async (ctx) => {
    await ctx.replyWithMarkdownV2(
      "Добро пожаловать\\!\nПодключите свое кафе к программе лояльности за несколько простых шагов\\.\n",
      {
        reply_markup: onboardingMenu,
      },
    );
  },
);

// CANCEL ANY
adminBot.hears("Отмена", async (ctx) => {
  await ctx.conversation.exit();
  await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
});
// CREATE CAFE
adminBot.hears("Создать кафе", async (ctx) => {
  await ctx.conversation.enter("createCafeConversation");
});

// CAFE LIST
adminBot.hears("Список моих кафе", async (ctx) => {
  const data = await fetchCafeListApiRequest({ userTgId: ctx.from?.id! });

  ctx.session.cafeList = data as Array<CafeListResponseType>;

  if (!data) {
    await ctx.reply("Вы еще не создали ни одного кафе.");
  } else {
    await ctx.reply("Список Ваших кафе:", { reply_markup: cafeListKeyboard });
  }
});

// EMPLOYEE LIST
adminBot.hears("Сотрудники", async (ctx) => {
  await ctx.editMessageReplyMarkup({ reply_markup: cafeEmployeesKeyboard });
});

// NEW NEWSLETTER
adminBot.hears(
  "Создать новую рассылку",
  (ctx) => ctx.conversation.enter("createNewsletterConversation"),
);

// Запустите бота.
adminBot.start();

adminBot.catch((err) => {
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
