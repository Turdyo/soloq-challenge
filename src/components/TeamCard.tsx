import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Prisma } from "@prisma/client"

import { AccountDataTable } from "./ui/data-table"
import { accountColumns } from "./account-columns"

type Props = {
  title: string
  description: string
  accounts: Array<
    Prisma.AccountGetPayload<{
      include: { lpUpdate: true }
    }>
  >
}

export function TeamCard({ title, description, accounts }: Props) {
  const totalGames = accounts.reduce((sum, account) => (account.wins || 0) + (account.losses || 0) + sum, 0)
  const winrate =
    accounts
      .map(account => {
        if (!account.wins || !account.losses) return 0
        return Math.round((account.wins / (account.wins + account.losses)) * 100)
      })
      .reduce((sum, winrate) => winrate + sum, 0) / accounts.length

  const dodges = accounts.flatMap(account => account.lpUpdate).filter(lpUpdate => lpUpdate.lastUpdateDiff === -5).length

  const totalDemote = accounts
    .flatMap(account => account.lpUpdate)
    .filter(lpUpdate => lpUpdate.lastUpdateDiff === -25 && lpUpdate.tier === "DIAMOND" && lpUpdate.LP === 75)

  const demoteStats = accounts.map(account => {
    const demotes = account.lpUpdate.filter(
      lpUpdate => lpUpdate.lastUpdateDiff === -25 && lpUpdate.tier === "DIAMOND" && lpUpdate.LP === 75
    )
    return {
      name: account.name,
      demotes: demotes.length
    }
  })

  const mostDemoteur = demoteStats.reduce((troller, demote) => (troller.demotes < demote.demotes ? demote : troller), demoteStats[0])

  return (
    <div className="flex flex-col gap-8">
      <AccountDataTable
        columns={accountColumns}
        data={accounts.sort((a, b) => {
          return a.lpUpdate.reduce((acc, lpupdate) => (lpupdate.LPC > acc.LPC ? lpupdate : acc)).LPC <
            b.lpUpdate.reduce((acc, lpupdate) => (lpupdate.LPC > acc.LPC ? lpupdate : acc)).LPC
            ? 1
            : -1
        })}
        title={title}
        lp={description}
      />
      <Card>
        <CardHeader>
          <CardTitle>{title.split(" ").splice(0, 2).join(" ")} - Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Nombre de games : {totalGames} </div>
          <div>Winrate : {Math.round(winrate * 10) / 10} %</div>
          <div>Nombre de dodges : {dodges}</div>
          <div>
            Nombre de demotes : {totalDemote.length} (dont {mostDemoteur.demotes} de {mostDemoteur.name})
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
