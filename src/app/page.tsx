import { Countdown } from "@/components/Countdown"
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

  const jiahLPC = jiah.reduce(
    (sum, account) => sum + account.lpUpdate.reduce((prevUpdate, update) => (update.LPC > prevUpdate.LPC ? update : prevUpdate)).LPC - 2800,
    0
  )
  const kurnothLPC = kurnoth.reduce(
    (sum, account) => sum + account.lpUpdate.reduce((prevUpdate, update) => (update.LPC > prevUpdate.LPC ? update : prevUpdate)).LPC - 2800,
    0
  )
  return (
    <div className="mt-5 flex flex-col items-center">
      <Countdown />
      <main className="mx-auto flex w-fit flex-col items-center gap-10 p-10 xl:flex-row">
        <TeamCard title={`Team Jiah ${jiahLPC > kurnothLPC ? "👑" : "🤡"}`} description={`${jiahLPC} LP`} accounts={jiah} />
        <TeamCard title={`Team Kurnoth ${kurnothLPC > jiahLPC ? "👑" : "🤡"}`} description={`${kurnothLPC} LP`} accounts={kurnoth} />
      </main>
    </div>
  )
}
