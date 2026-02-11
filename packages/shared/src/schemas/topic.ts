import { z } from 'zod';

export const TopicSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "标题不能为空"),
  description: z.string().optional(),
  content: z.string().optional(), // 引导内容/台词
  category: z.string().optional(), // 分类：生活、习俗、童谣等
  difficulty: z.number().min(1).max(5).default(1),
  is_active: z.boolean().default(true),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateTopicSchema = TopicSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateTopicSchema = TopicSchema.partial().omit({ 
  created_at: true, 
  updated_at: true 
});
