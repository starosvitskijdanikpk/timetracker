import { prisma } from "./prismaClient.js";

async function main() {
  await prisma.timeEntry.deleteMany();
  await prisma.taskName.deleteMany();
  await prisma.project.deleteMany();

  const projects = await Promise.all([
    prisma.project.create({ data: { name: "WebApp Redesign", color: "#2dd4bf" } }),
    prisma.project.create({ data: { name: "Analytics Platform", color: "#f5a623" } }),
    prisma.project.create({ data: { name: "Mobile App v2", color: "#818cf8" } }),
  ]);

  const [webapp, analytics, mobile] = projects;

  const now = new Date();
  const d = (h: number, m: number) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);

  await prisma.timeEntry.createMany({
    data: [
      {
        taskName: "Розробка API ендпоінтів",
        projectId: webapp.id,
        startTime: d(9, 0),
        endTime: d(10, 30),
        duration: 5400,
      },
      {
        taskName: "Розробка компонентів форм",
        projectId: webapp.id,
        startTime: d(11, 0),
        endTime: d(12, 11),
        duration: 4260,
      },
      {
        taskName: "Побудова дашборду з графіками",
        projectId: analytics.id,
        startTime: d(13, 0),
        endTime: d(15, 30),
        duration: 9000,
      },
      {
        taskName: "Налаштування фільтрів звітів",
        projectId: analytics.id,
        startTime: d(15, 30),
        endTime: d(16, 0),
        duration: 1800,
      },
      {
        taskName: "Зустріч з клієнтом",
        projectId: mobile.id,
        startTime: d(16, 0),
        endTime: d(16, 20),
        duration: 1200,
      },
    ],
  });

  await prisma.taskName.createMany({
    data: [
      { name: "Розробка API ендпоінтів" },
      { name: "Розробка компонентів форм" },
      { name: "Побудова дашборду з графіками" },
      { name: "Налаштування фільтрів звітів" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
