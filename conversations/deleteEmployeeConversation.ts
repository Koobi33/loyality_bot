import { deleteEmployeeApiRequest } from "api";
import { MyContext, MyConversation } from "types";

export async function deleteEmployeeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply("Удаление сотрудника");

  // Попросить название
  await ctx.reply(
    "Если вы уверены, что хотите удалить сотрудника, напишите 'удалить' в чат",
  );

  const answer: string = await conversation.form.text();
  if (answer.toLowerCase() === "удалить") {
    await conversation.external(() =>
      deleteEmployeeApiRequest({
        cafeId: ctx.session.currentCafe?.cafeId!,
        adminTelegramId: ctx.from?.id!,
        employeeTgId: ctx.session.currentUser?.tgId!,
      })
    );
    // Вывести сообщении о том, что создано
    await ctx.reply("Финиш ебабоба");
  }

  return;
}
