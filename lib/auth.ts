import { prisma } from './prisma';

export async function getUserId(req: Request) {
  const url = new URL(req.url);
  const alias = url.searchParams.get('user') || 'DemoUser';
  const id = `demo_${alias.toLowerCase()}`;
  await prisma.user.upsert({
    where: { id },
    update: { alias },
    create: { id, alias },
  });
  return id;
}