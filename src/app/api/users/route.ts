import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { z } from 'zod';
import { parseListQuery } from '@/lib/pagination';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128);

const emailSchema = z
  .string()
  .trim()
  .min(3)
  .max(200)
  .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Invalid email');

const createSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(2).max(120),
  password: passwordSchema,
  role: z.enum(['admin', 'editor']).optional(),
  isActive: z.boolean().optional(),
});

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  email: emailSchema.optional(),
  name: z.string().trim().min(2).max(120).optional(),
  password: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    passwordSchema.optional(),
  ),
  role: z.enum(['admin', 'editor']).optional(),
  isActive: z.boolean().optional(),
});

function publicUser(user: {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const { error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const { take, skip } = parseListQuery(request, { take: 100, max: 200 });
    const users = await db.adminUser.findMany({
      orderBy: { createdAt: 'asc' },
      take,
      skip,
    });
    return NextResponse.json(users.map(publicUser));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid user data. Password must be at least 10 characters.' },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const exists = await db.adminUser.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const user = await db.adminUser.create({
      data: {
        email,
        name: parsed.data.name,
        passwordHash: hashPassword(parsed.data.password),
        role: parsed.data.role ?? 'editor',
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json(publicUser(user), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { session, error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
      return NextResponse.json(
        { error: first || 'Invalid user data. Password must be at least 8 characters.' },
        { status: 400 },
      );
    }

    const { id, password, email, ...rest } = parsed.data;
    const data: Record<string, unknown> = { ...rest };
    if (email) data.email = email.toLowerCase();
    if (password) data.passwordHash = hashPassword(password);

    if (session?.user?.id && String(id) === session.user.id && rest.isActive === false) {
      return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 });
    }

    const user = await db.adminUser.update({
      where: { id },
      data,
    });

    return NextResponse.json(publicUser(user));
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { session, error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '', 10);
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (session?.user?.id && String(id) === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const admins = await db.adminUser.count({ where: { role: 'admin', isActive: true } });
    const target = await db.adminUser.findUnique({ where: { id } });
    if (target?.role === 'admin' && admins <= 1) {
      return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 });
    }

    await db.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
