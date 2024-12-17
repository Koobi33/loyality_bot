import { deleteEmployeeApiRequest } from "api";
import { MyContext, MyConversation } from "types";
import { cancelMenu, menuKeyboard } from "keyboards";

export async function deleteEmployeeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply("Удаление сотрудника", { reply_markup: cancelMenu });

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
    await ctx.reply(`Сотрудник был успешно удален`);
  }

  if (answer === "Отмена") {
    await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
    return;
  }

  return;
}
