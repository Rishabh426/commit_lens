import prisma from "../db/prismaClient";

export async function storeCommit(commitSHA: string, files: { fileName : string; content : string }[]) {
    await prisma.commit.upsert({
        where: { sha: commitSHA },
        update: {},
        create: {
            sha: commitSHA,
            files: {
                create: files.map(file => ({
                    fileName: file.fileName,    
                    content: file.content,
                })),
            },
        },
    });

    console.log(`Stored commit ${commitSHA} in Neon DB`);
}