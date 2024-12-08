import { MyContext, MyConversation } from "types";
import { createNewsletterApiRequest, getCustomersListApiRequest } from "api";
import { bot } from "../adminBot.ts";

export async function createNewsletterConversation(
    conversation: MyConversation,
    ctx: MyContext,
) {
    await ctx.reply("Создать новую рассылку");

    await ctx.reply(
        "Введите текст рассылки - его получат все клиенты Вашего кафе. Помните, что вы не можете создавать более 2 рассылок в месяц.",
    );
    const message: string = await conversation.form.text();

    await conversation.external(() =>
        createNewsletterApiRequest({
            cafeId: ctx.session.currentCafe?.cafeId!,
            adminTgId: ctx.from?.id!,
            message,
        })
    );

    const usersList = await conversation.external(() =>
        getCustomersListApiRequest({
            cafeId: ctx.session.currentCafe?.cafeId!,
            masterId: 0,
        })
    );

    
    await ctx.reply(message)
    await ctx.reply(
        `Такое сообщение получат ${usersList.cafeUsers.users.length} клиентов Вашего кафе. Чтобы разослать сообщение напишите слово "отправить"`,
    );
    
    const confirm: string = await conversation.form.text();


    if (confirm.toLowerCase() === 'отправить') {


        console.log(usersList);
    


        //   for (let i = 0; i < usersList.cafeUsers.users.length; i++) {
        for (let i = 0; i < usersList.cafeUsers.owners.length; i++) {
            await bot.api.sendMessage(usersList.cafeUsers.owners[i], message);
        }

        // Вывести сообщении о том, что создано
        await ctx.reply("Финиш ебабоба");
        
    }
    return;
}
