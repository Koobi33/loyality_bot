import { createCafeApiRequest } from 'api'
import { MyContext, MyConversation } from "types";

  

export async function createCafeConversation(conversation: MyConversation, ctx: MyContext) {    
    
    await ctx.reply("Создать новое кафе")
    
    // Попросить название
    await ctx.reply("Введите название вашего кафе");
    const cafeNameContext: string = await conversation.form.text();

    // Ввести кол-во покупок необходимых для подарка
    await ctx.reply("Введите кол-во покупок, необходимых для получения подарка");
    const purchaseCountContext: number = await conversation.form.number();
    
    await conversation.external(() => createCafeApiRequest({
        cafeName: cafeNameContext,
        userTgId: ctx.from?.id!,
        cafeConfig: { purchaseCount: purchaseCountContext }
    }))
    
    // Вывести сообщении о том, что создано
    await ctx.reply("Финиш ебабоба");

    return;
}