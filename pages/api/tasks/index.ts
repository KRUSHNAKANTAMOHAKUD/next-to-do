import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const tasks = await prisma.task.findMany();
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { title } = req.body;
    const newTask = await prisma.task.create({ data: { title } });
    return res.status(201).json(newTask);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
