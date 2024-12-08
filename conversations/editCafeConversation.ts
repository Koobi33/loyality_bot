

import { editCafeApiRequest } from 'api'
import { MyContext, MyConversation } from "types";

  

export async function editCafeNameConversation(conversation: MyConversation, ctx: MyContext) {    
    
    await ctx.reply("Изменить название вашего кафе")
    
    // Попросить название
    await ctx.reply("Введите название вашего кафе");
    const cafeNameContext: string = await conversation.form.text();


    await conversation.external(() => editCafeApiRequest({ cafeId: ctx.session.currentCafe?.cafeId!, newCafeName: cafeNameContext, adminTgId: ctx.from?.id!, cafeConfig: { purchaseCount: ctx.session.currentCafe!.purchaseCount } }))
    
    // Вывести сообщении о том, что создано
    await ctx.reply("Финиш ебабоба");

    return;
}

export async function editCafePurchaseCountConversation(conversation: MyConversation, ctx: MyContext) {
    
    
    await ctx.reply("Изменить кол-во покупок, необходимых для подарка")
        
    // Попросить название
    await ctx.reply("Введите кол-во покупок, необходимых для подарка");
    const cafePurchaseCountContext: number = await conversation.form.number();
    
    
    await conversation.external(() => editCafeApiRequest({ cafeId: ctx.session.currentCafe?.cafeId!, newCafeName: ctx.session.currentCafe?.cafeName!, adminTgId: ctx.from?.id!, cafeConfig: { purchaseCount: cafePurchaseCountContext } }))
        
    // Вывести сообщении о том, что создано
    await ctx.reply("Финиш ебабоба");
    
    return;
}

