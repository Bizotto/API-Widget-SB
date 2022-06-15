import express from 'express';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';
import { SubmitFeedbackUseCase } from './use-cases/submitFeedbackUseCase';
import { PrismaFeedbacksRepository } from './repositories/prisma/prismaFeedbacksRepository';

export const routes = express.Router();

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '288e7a799d401f',
    pass: '5ddaf53814b16a',
  },
});

routes.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    prismaFeedbacksRepository
  );

  await submitFeedbackUseCase.execute({
    type,
    comment,
    screenshot,
  });

  await transport.sendMail({
    from: 'Equipe SafeBank <CEO@safebank.com>',
    to: 'Nicolas Bizotto <Nicolas@safebank.com>',
    subject: 'Novo feedback',
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #111;" >`,
      `<p> Tipo do feedback: ${type}</p>`,
      `<p> Comentário: ${comment}</p>`,
      `<p> Screenshot: ${screenshot}</p>`,
      `<div/>`,
    ].join('\n'),
  });
  return res.status(201).send()
});
