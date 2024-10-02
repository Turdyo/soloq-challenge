import { fetchAccountData } from "@/lib/accounts"
import db from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const accounts = await db.account.findMany()

  for (const account of accounts) {
    const data = await fetchAccountData(account.id)
    console.log(`done fetching ${account.name} ${data?.tier} ${data?.rank} ${data?.LP}`)
    await new Promise(r => setTimeout(r, 1300))
  }

  return NextResponse.json("done")
}
