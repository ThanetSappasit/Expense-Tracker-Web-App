import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type CreateUserBody = {
  email?: string;
  name?: string | null;
};

export async function POST(request: Request) {
  let body: CreateUserBody = {};

  try {
    body = (await request.json()) as CreateUserBody;
  } catch {
    // Ignore invalid/missing JSON; we'll generate mock data below.
  }

  const timestamp = Date.now();
  const email =
    body.email?.trim() ||
    `mock.user.${timestamp}.${Math.floor(Math.random() * 1000)}@example.com`;
  const name =
    body.name === undefined ? `Mock User ${timestamp}` : body.name?.trim() || null;

  try {
    const user = await db.user.create({
      data: { email, name },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to create user." },
      { status: 500 }
    );
  }
}
