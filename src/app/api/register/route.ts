import { fetchAccountData, registerAccount } from "@/lib/accounts"
import db from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const RegisterBodySchema = z.object({
  discordId: z.string(),
  name: z.string(),
  accounts: z.array(z.string()),
  role: z.enum(["top", "jungle", "mid", "adc", "support"])
})

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const parsedBody = RegisterBodySchema.parse(await req.json())
  const accounts = parsedBody.accounts
    .flatMap(account => {
      return account.split(",")
    })
    .map(acc => decodeURI(acc).replace(/\s/g, ""))

  const player = await db.player.upsert({
    where: { discordId: parsedBody.discordId },
    create: {
      discordId: parsedBody.discordId,
      name: parsedBody.name,
      role: parsedBody.role
    },
    update: {
      discordId: parsedBody.discordId,
      name: parsedBody.name,
      role: parsedBody.role
    }
  })

  await Promise.all(
    accounts.map(async account => {
      const [name, tag] = account.split("#")
      const registeredAccount = await registerAccount(name, tag, player.discordId)
      if (registeredAccount) {
        await fetchAccountData(registeredAccount.id)
      }
    })
  )

  return NextResponse.json("done")
}
