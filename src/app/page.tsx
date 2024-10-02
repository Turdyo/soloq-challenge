import { TeamCard } from "@/components/TeamCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import db from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page() {
  const jiah = await db.account.findMany({
    orderBy: { LPC: "desc" },
    where: { player: { team: "Jiah" } }
  })

  const kurnoth = await db.account.findMany({
    orderBy: { LPC: "desc" },
    where: { player: { team: "Kurnoth" } }
  })

  return (
    <main className="mx-auto flex w-fit items-center gap-6 p-10">
      <TeamCard title="Team Jiah" description="???" accounts={jiah} />
      <TeamCard title="Team Kurnoth" description="Goats" accounts={kurnoth} />
    </main>
  )
}
