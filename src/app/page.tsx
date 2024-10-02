import { TeamCard } from "@/components/TeamCard"
import db from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Page() {
  const jiah = await db.account.findMany({
    orderBy: { LPC: "desc" },
    where: { player: { team: "Jiah" } },
    include: { lpUpdate: true }
  })

  const kurnoth = await db.account.findMany({
    orderBy: { LPC: "desc" },
    where: { player: { team: "Kurnoth" } },
    include: { lpUpdate: true }
  })

  const jiahLPC = jiah.reduce((acc, account) => acc + account.LPC! - 2800, 0)
  const kurnothLPC = kurnoth.reduce((acc, account) => acc + account.LPC! - 2800, 0)
  return (
    <main className="mx-auto flex w-fit items-center gap-6 p-10">
      <TeamCard
        title={`Team Jiah ${jiahLPC > kurnothLPC ? "👑" : "🤡"}`}
        description={`${jiahLPC} LP`}
        accounts={jiah}
      />
      <TeamCard
        title={`Team Kurnoth ${kurnothLPC > jiahLPC ? "👑" : "🤡"}`}
        description={`${kurnothLPC} LP`}
        accounts={kurnoth}
      />
    </main>
  )
}
