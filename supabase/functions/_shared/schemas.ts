import { z } from "npm:zod@3.25.76";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4_000),
}).strict();

export const chatMessagesSchema = z.array(chatMessageSchema).min(1).max(30);

export const driverChatRequestSchema = z.object({
  messages: chatMessagesSchema,
  driverSlug: z.string().regex(/^[a-z0-9_-]{1,64}$/),
  driverName: z.string().trim().min(1).max(100),
}).strict();

export const driverDynamicRequestSchema = z.object({
  dynamicType: z.enum(["scenario", "builder", "debate", "mindmap", "roleplay", "microlearning", "digitaltwin"]),
  driverName: z.string().trim().min(1).max(100),
  driverSlug: z.string().regex(/^[a-z0-9_-]{1,64}$/),
  messages: chatMessagesSchema.optional().default([]),
  userInput: z.string().trim().max(4_000).optional().default(""),
}).strict();

export const estrategiaChatRequestSchema = z.object({
  messages: chatMessagesSchema,
}).strict();

export const estrategiaRewriteRequestSchema = z.object({
  question: z.string().trim().max(1_000).optional().default(""),
  answer: z.record(z.string().max(100), z.unknown()),
}).strict();

export const generateDocumentRequestSchema = z.object({
  cycle_id: z.string().uuid(),
  kind: z.enum(["drps", "action_plan", "executive_summary"]),
}).strict();

export const nexoDriverRecommendationsRequestSchema = z.object({
  cycle_id: z.string().uuid(),
  scope_type: z.enum(["cycle"]).optional().default("cycle"),
  scope_id: z.string().uuid().nullable().optional(),
}).strict();

export const generatePdfRequestSchema = z.object({
  driverName: z.string().trim().min(1).max(100),
  driverSlug: z.string().regex(/^[a-z0-9_-]{1,64}$/),
  pdfType: z.enum(["technical", "poetic"]),
  context: z.string().trim().max(12_000).optional().default(""),
}).strict();
