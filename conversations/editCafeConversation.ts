import { editCafeApiRequest } from "api";
import { MyContext, MyConversation } from "types";
import { cancelMenu, menuKeyboard } from "keyboards";

export async function editCafeNameConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply("Введите название вашего кафе", { reply_markup: cancelMenu });
  const cafeNameContext: string = await conversation.form.text();
  if (cafeNameContext === "Отмена") {
    await ctx.reply("Действие отменено", { reply_markup: menuKeyboard });
    return;
  }

  await conversation.external(() =>
    editCafeApiRequest({
      cafeId: ctx.session.currentCafe?.cafeId!,
      newCafeName: cafeNameContext,
      adminTgId: ctx.from?.id!,
      cafeConfig: { purchaseCount: ctx.session.currentCafe!.purchaseCount },
    })
  );

  await ctx.reply("Название кафе было успешно изменено.", {
    reply_markup: menuKeyboard,
  });

  return;
}

export async function editCafePurchaseCountConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  let cafePurchaseCountContext: number = 0
  do {
    await ctx.reply("Введите кол-во покупок, необходимых для подарка", {
      reply_markup: cancelMenu,
    });

    cafePurchaseCountContext = await conversation.form.number();
  } while (cafePurchaseCountContext <= 0);

  await conversation.external(() =>
    editCafeApiRequest({
      cafeId: ctx.session.currentCafe?.cafeId!,
      newCafeName: ctx.session.currentCafe?.cafeName!,
      adminTgId: ctx.from?.id!,
      cafeConfig: { purchaseCount: cafePurchaseCountContext },
    })
  );

  await ctx.reply(
    "Кол-во покупок, необходимых для подарка, было успешно изменено.",
    { reply_markup: menuKeyboard },
  );

  return;
}
