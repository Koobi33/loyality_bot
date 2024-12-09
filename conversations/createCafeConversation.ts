import { createCafeApiRequest } from 'api'
import { MyContext, MyConversation } from "types";

  

export async function createCafeConversation(conversation: MyConversation, ctx: MyContext) {    
    
    // Попросить название
    await ctx.reply("Введите название нового кафе");
    const cafeName: string = await conversation.form.text();

    // Ввести кол-во покупок необходимых для подарка
    await ctx.reply("Введите кол-во покупок, необходимых для получения подарка");
    const purchaseCountContext: number = await conversation.form.number();
    
    await conversation.external(() => createCafeApiRequest({
        cafeName,
        userTgId: ctx.from?.id!,
        cafeConfig: { purchaseCount: purchaseCountContext }
    }))
    
    // Вывести сообщении о том, что создано
    await ctx.reply(`Кафе с названием ${cafeName} было успешно создано!`);

    return;
}