import { MyContext, MyConversation } from "types";
import { createNewsletterApiRequest, getCustomersListApiRequest } from "api";
import { loyalityBot } from "../loyalityBot.ts";
import { cancelMenu, menuKeyboard } from "keyboards";

export async function createNewsletterConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  if (ctx.session.currentCafe?.availableNoticeCount === 0) {
    await ctx.reply("Вы исчерпали лимит рассылок в этом месяце!");
    return;
  }

  await ctx.reply(
    `Введите текст рассылки - его получат все клиенты Вашего кафе. Помните, что вы не можете создавать более 2 рассылок в месяц. Осталось рассылок: ${ctx.session.currentCafe?.availableNoticeCount} в этом месяце.`,
    { reply_markup: cancelMenu },
  );

  const message: string = await conversation.form.text();

  if (message === "Отмена") {
    await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
    return;
  }

  await conversation.external(() =>
    createNewsletterApiRequest({
      cafeId: ctx.session.currentCafe?.cafeId!,
      adminTgId: ctx.from?.id!,
      message,
    })
  );

  const usersList = await conversation.external(() =>
    getCustomersListApiRequest({
      cafeId: ctx.session.currentCafe?.cafeId!,
      masterId: Deno.env.get("MASTER_BOT_ID")!,
    })
  );

  await ctx.reply(`${ctx.session.currentCafe?.cafeName}: ${message}`);
  await ctx.reply(
    `Такое сообщение получат ${usersList.cafeUsers.users.length} клиентов Вашего кафе. Чтобы разослать сообщение напишите слово "отправить"`,
  );

  const confirm: string = await conversation.form.text();

  if (confirm.toLowerCase() === "отправить") {
    for (let i = 0; i < usersList.cafeUsers.users.length; i++) {
      await loyalityBot.api.sendMessage(
        usersList.cafeUsers.users[i],
        `${ctx.session.currentCafe?.cafeName}: ${message}`,
      );
    }

    // Вывести сообщении о том, что создано
    await ctx.reply("Рассылка успешно была отправлена!");
  }
  return;
}
