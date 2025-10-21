import prisma from "../prisma/client"

export const getUserModel = async (username: string) => {
    return await prisma.user.findUnique({where: {username: username}})
};