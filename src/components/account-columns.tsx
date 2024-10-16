"use client"

import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Check, CircleDashedIcon, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const accountColumns: ColumnDef<
  Prisma.AccountGetPayload<{
    include: { lpUpdate: true }
  }>
>[] = [
  {
    header: "Comptes",
    cell: ({ row }) => {
      const account = row.original
      const [gameName, tagLine] = account.name.split("#")

      return (
        <Link href={`https://www.op.gg/summoners/euw/${gameName}-${tagLine}`} target="_blank" className="flex items-center gap-4 p-1">
          <Image src={account.profileIcon} width={32} height={32} alt="pp" className="rounded-full" />
          <span className="text-nowrap">
            {gameName} <span className="text-muted-foreground">#{tagLine}</span>
          </span>
        </Link>
      )
    }
  },
  {
    header: "Elo actuel",
    cell: ({ row }) => {
      const account = row.original
      return (
        <div className="flex items-center gap-2 text-nowrap p-1">
          <Image
            src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${account.tier?.toLowerCase()}.png`}
            width={30}
            height={30}
            alt={account.tier!}
          />
          {account.rank}
          <span>
            {account.LP} <span className="text-muted-foreground">LP</span>
          </span>
        </div>
      )
    }
  },
  {
    header: "Peak Elo",
    cell: ({ row }) => {
      const account = row.original
      const peakLpUpdate = account.lpUpdate.reduce((acc, lpupdate) => (lpupdate.LPC > acc.LPC ? lpupdate : acc))

      return (
        <div className="flex items-center gap-2 text-nowrap p-1">
          <Image
            src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${peakLpUpdate.tier?.toLowerCase()}.png`}
            width={30}
            height={30}
            alt={peakLpUpdate.tier!}
          />
          {peakLpUpdate.rank}
          <span>
            {peakLpUpdate.LP} <span className="text-muted-foreground">LP</span>
          </span>
        </div>
      )
    }
  },
  {
    header: "Winrate",
    cell: ({ row }) => {
      const account = row.original
      const winrate = account.wins && account.losses ? account.wins / (account.losses + account.wins) : 0
      return (
        <div className="flex flex-col items-center">
          <p>
            {(winrate * 100).toFixed(0)} <span className="text-muted-foreground">%</span>
          </p>
          <div className="flex gap-1">
            <p className="text-[#5383e8] opacity-90">{account.wins}V</p>
            <p className="text-[#e84057] opacity-90">{account.losses}D</p>
          </div>
        </div>
      )
    }
  },

  {
    header: "Streak",
    cell: ({ row }) => {
      const account = row.original
      return (
        <div className="flex gap-px">
          {account.lpUpdate
            .slice(-7)
            .filter(update => update.lastUpdateDiff !== 0)
            .map(update => {
              const isDodge = Math.abs(update.lastUpdateDiff) === 5
              return (
                <div className="flex flex-col items-center" key={update.id}>
                  {isDodge ? (
                    <div className="flex size-5 items-center justify-center">
                      <CircleDashedIcon size={18} color="#eab308" className="opacity-60" />
                    </div>
                  ) : update.lastUpdateDiff > 0 ? (
                    <Check size={20} color="#5383e8" />
                  ) : (
                    <X size={20} color="#e84057" />
                  )}
                  <span
                    className={`text-xs text-opacity-80 ${isDodge ? "text-yellow-500/60" : update.lastUpdateDiff > 0 ? "text-[#5383e8]" : "text-[#e84057]"}`}
                  >
                    {Math.abs(update.lastUpdateDiff)}
                  </span>
                </div>
              )
            })}
        </div>
      )
    }
  }
]
