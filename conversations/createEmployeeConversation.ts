import { createEmployeeInviteApiRequest } from "api";
import { MyContext, MyConversation, UserRole } from "types";
import { cancelMenu, employeeRoleMenu, menuKeyboard } from "keyboards";

export async function createEmployeeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply("Добавление нового сотрудника", {
    reply_markup: cancelMenu,
  });

  await ctx.reply("Выберите роль для нового сотрудника", {
    reply_markup: employeeRoleMenu,
  });

  const response = await conversation.waitForCallbackQuery([
    UserRole.Admin,
    UserRole.Employee,
  ], {
    otherwise: async (ctx) => {
      if (ctx.update.message?.text === "Отмена") {
        return;
      } else {
        await ctx.reply("Выберите одну из опций", { reply_markup: employeeRoleMenu });
      }
    },
  });
  const role: UserRole = response.match as UserRole;
  const res = await conversation.external(() =>
    createEmployeeInviteApiRequest({
      cafeId: ctx.session.currentCafe?.cafeId!,
      senderTgId: ctx.from?.id!,
      role,
    })
  );

  const inviteId = res.inviteId;

  await ctx.reply(
    `Чтоб пригласить сотрудника с ролью ${role} в кафе ${ctx.session.currentCafe?.cafeName} перешлите ему эту ссылку ${
      Deno.env.get("EMPLOYEE_BOT_ADDRESS")
    }?start=${inviteId}`,
  );

  await ctx.reply(
    "Как только сотрудник перейдет по ссылке и запустит нашего бота, он появится в списке Ваших сотрудников и сможет приступить к работе.",
    { reply_markup: menuKeyboard },
  );

  return;
}
