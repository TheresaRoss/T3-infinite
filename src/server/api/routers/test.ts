import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
 create:publicProcedure.input(z.object({name:z.string(),age:z.number(),stupidity: z.string().optional()})).mutation(async ({ctx,input})=>{
    const create  = await ctx.prisma.user.create({
        data:input
    })
    return create
 }),
 getall:publicProcedure.input(z.object({limit: z.number(),
cursor: z.string().nullish(),
skip: z.number().optional(),
userId:z.string().optional()})).query(async({ctx,input})=>{
    const {limit, skip, userId, cursor} = input;
    const items = await ctx.prisma.user.findMany({
      take: limit+1,
      skip:skip,
      cursor: cursor?{id:cursor}:undefined,
      where:{
         id: userId? userId:undefined
      }
    })
    let nextCursor: typeof cursor| undefined = undefined
    if(items.length > limit){
      const nextItem = items.pop()
      nextCursor = nextItem?.id
    }

    return{
      items,nextCursor
    }
 })
});

export type serRouter = typeof userRouter
