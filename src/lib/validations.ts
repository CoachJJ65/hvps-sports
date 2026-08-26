import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const pinSignInSchema = z.object({
  pin: z.string().trim().min(4).max(8),
  email: z.string().email().optional().or(z.literal('')),
});

export const grokChatSchema = z.object({
  prompt: z.string().trim().min(1).max(4000),
});

export type GrokChatInput = z.infer<typeof grokChatSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  role: z
    .enum([
      'ADMIN',
      'HOD_SPORTS',
      'HEAD_OF_SPORTS',
      'COACH',
      'PARENT',
      'MEMBER',
    ])
    .optional(),
  pin: z.string().trim().min(4).max(8).optional(),
});

export const noticeSchema = z.object({
  title: z.string().trim().min(2).max(160),
  content: z.string().trim().min(2).max(4000),
  type: z.enum(['GENERAL', 'WEATHER', 'LIGHTNING']).optional(),
});

export const attendanceSchema = z.object({
  teamId: z.string().min(1),
  date: z.string().min(1),
  records: z.record(z.string(), z.enum(['PRESENT', 'ABSENT', 'EXCUSED'])),
});

export const selectionsSchema = z.object({
  fixtureId: z.string().min(1),
  selections: z.array(
    z.object({
      playerId: z.string().min(1),
      position: z.string().trim().max(40).nullable().optional(),
    })
  ),
});

export const fixtureUpdateSchema = z.object({
  homeScore: z.union([z.number().int(), z.string(), z.null()]).optional(),
  awayScore: z.union([z.number().int(), z.string(), z.null()]).optional(),
  status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED']).optional(),
  notes: z.string().max(4000).nullable().optional(),
  busTime: z.string().nullable().optional(),
  location: z.string().trim().max(160).optional(),
});

export const formDocumentSchema = z.object({
  title: z.string().trim().min(2).max(200),
  type: z.enum([
    'TOURNAMENT_SCHEDULE',
    'COACHES_PLANNER',
    'TEAM_SHEET',
    'RUGBY_RULES',
    'GENERAL',
  ]),
  sportId: z.string().nullable().optional(),
  contentJson: z.union([z.string().min(2), z.record(z.string(), z.unknown())]),
  isPublished: z.boolean().optional(),
});

export const formDocumentUpdateSchema = formDocumentSchema.partial();

export const setPinSchema = z.object({
  pin: z.string().trim().min(4).max(8).nullable().optional(),
});
