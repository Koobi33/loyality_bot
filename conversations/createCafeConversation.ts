import { createCafeApiRequest, createEmployeeInviteApiRequest } from "api";
import { MyContext, MyConversation, ROLE_MAPPING, UserRole } from "types";
import { cancelMenu, employeeRoleMenu, menuKeyboard } from "keyboards";
import { InputFile } from "grammy";
import { decodeBase64 } from "jsr:@std/encoding/base64";
import { qrcode } from "qrcode";

export async function createCafeConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  // Попросить название
  await ctx.reply("Введите название нового кафе", {
    reply_markup: cancelMenu,
  });
  const cafeName: string = await conversation.form.text();
  if (cafeName === "Отмена") {
    await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
    return;
  }

  // Ввести кол-во покупок необходимых для подарка
  await ctx.reply("Введите кол-во покупок, необходимых для получения подарка");
  const purchaseCountContext: number = await conversation.form.number(
    async (ctx) => {
      if (ctx.update.message?.text === "Отмена") {
        await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
        return;
      } else {
        ctx.reply("Нужно ввести число");
      }
    },
  );

  const { cafeId } = await conversation.external(() =>
    createCafeApiRequest({
      cafeName,
      userTgId: ctx.from?.id!,
      cafeConfig: { purchaseCount: purchaseCountContext },
    })
  );

  // Вывести сообщении о том, что создано
  await ctx.reply(
    `Кафе с названием ${cafeName} было успешно создано!\nТеперь добавьте в него первого сотрудника, для этого - просто выберите для него подходящую роль.`,
  );

  await ctx.reply("Выберите роль для нового сотрудника", {
    reply_markup: employeeRoleMenu,
  });

  const response = await conversation.waitForCallbackQuery([
    UserRole.Admin,
    UserRole.Employee,
  ], {
    otherwise: async (ctx) => {
      if (ctx.update.message?.text === "Отмена") {
        await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
        return;
      } else {
        ctx.reply("Выберите одну из опций", { reply_markup: employeeRoleMenu });
      }
    },
  });
  const role: UserRole = response.match as UserRole;
  const res = await conversation.external(() =>
    createEmployeeInviteApiRequest({
      cafeId: cafeId!,
      senderTgId: ctx.from?.id!,
      role,
    })
  );

  const inviteId = res.inviteId;

  await ctx.reply(
    `Чтоб пригласить сотрудника с ролью ${
      ROLE_MAPPING[role]
    } в кафе ${cafeName} перешлите ему эту ссылку:\n\n\n${
      Deno.env.get("EMPLOYEE_BOT_ADDRESS")
    }?start=${inviteId}`,
  );

  await ctx.reply(
    "Как только сотрудник перейдет по ссылке и запустит нашего бота, он появится в списке Ваших сотрудников и сможет приступить к работе.",
  );

  const qr = await qrcode(
    `${Deno.env.get("MORDA_ADDRESS")}?startapp=${cafeId}`,
  );
  const qrData = new InputFile(decodeBase64(qr.split(",")[1]));
  await ctx.replyWithPhoto(qrData);
  await ctx.reply(
    "Поздравляем! Создание кафе и первые шаги завершены.\nИспользуйте QR-code выше в своем кафе. Сканируя его, ваши гости смогут участвовать в программе лояльности.\nДля добавления других сотрудников, создания рассылок и т.д. перейдите в 'Список моих кафе'",
    { reply_markup: menuKeyboard },
  );

  return;
}
