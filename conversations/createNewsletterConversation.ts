import { MyContext, MyConversation } from "types";
import { createNewsletterApiRequest, getCustomersListApiRequest } from "api";
import { loyalityBot } from "../loyalityBot.ts";

export async function createNewsletterConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  if (ctx.session.currentCafe?.availableNoticeCount === 0) {
    await ctx.reply("Вы исчерпали лимит рассылок в этом месяце!");
    return;
  }

  await ctx.reply(
    `Введите текст рассылки - его получат все клиенты Вашего кафе. Помните, что вы не можете создавать более ${ctx.session.currentCafe?.availableNoticeCount} рассылок в месяц.`,
  );

  const message: string = await conversation.form.text();

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
      masterId: 0,
    })
  );

  await ctx.reply(`${ctx.session.currentCafe?.cafeName}: ${message}`);
  await ctx.reply(
    `Такое сообщение получат ${usersList.cafeUsers.users.length} клиентов Вашего кафе. Чтобы разослать сообщение напишите слово "отправить"`,
  );

  const confirm: string = await conversation.form.text();

  if (confirm.toLowerCase() === "отправить") {
    console.log(usersList);

    //   for (let i = 0; i < usersList.cafeUsers.users.length; i++) {
    for (let i = 0; i < usersList.cafeUsers.owners.length; i++) {
      await loyalityBot.api.sendMessage(usersList.cafeUsers.owners[i], `${ctx.session.currentCafe?.cafeName}: ${message}`);
    }

    // Вывести сообщении о том, что создано
    await ctx.reply("Рассылка успешно была отправлена!");
  }
  return;
}
