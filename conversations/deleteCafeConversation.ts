import { deleteCafeApiRequest } from "api";
import { MyContext, MyConversation } from "types";

export async function deleteCafeConversation(conversation: MyConversation, ctx: MyContext) {
    
    
    await ctx.reply("Удаление кафе")
        
    // Попросить название
    await ctx.reply("Если вы уверены, что хотите удалить кафе, напишите 'удалить' в чат");
    
    const answer: string = await conversation.form.text();
    if (answer.toLowerCase() === 'удалить') {
        await conversation.external(() => deleteCafeApiRequest({ cafeId: ctx.session.currentCafe?.cafeId!, adminTgId: ctx.from?.id! }))
        // Вывести сообщении о том, что создано
        await ctx.reply("Финиш ебабоба");
    }
    
    return;
}