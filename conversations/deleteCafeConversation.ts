import { deleteCafeApiRequest } from "api";
import { MyContext, MyConversation } from "types";
import { cancelMenu, menuKeyboard } from "keyboards";

export async function deleteCafeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply("Удаление кафе");

  await ctx.reply(
    "Если вы уверены, что хотите удалить кафе, напишите 'удалить' в чат",
    { reply_markup: cancelMenu },
  );

  const answer: string = await conversation.form.text();
  if (answer.toLowerCase() === "удалить") {
    await conversation.external(() =>
      deleteCafeApiRequest({
        cafeId: ctx.session.currentCafe?.cafeId!,
        adminTgId: ctx.from?.id!,
      })
    );
    await ctx.reply("Кафе было успешно удалено.", {
      reply_markup: menuKeyboard,
    });
  }
  if (answer === "Отмена") {
    await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
    return;
  }

  return;
}
