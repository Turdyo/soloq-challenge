"use client"

import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Check, CircleDashedIcon, MoreHorizontal, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"

dayjs.extend(relativeTime)

export const accountColumns: ColumnDef<
  Prisma.AccountGetPayload<{
    include: { lpUpdate: true }
  }>
>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original
      const [gameName, tagLine] = account.name.split("#")

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Link href={`https://www.op.gg/summoners/euw/${gameName}-${tagLine}`} target="_blank" className="w-full">
                OP.GG
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`https://www.leagueofgraphs.com/fr/summoner/euw/${gameName}-${tagLine}`} target="_blank" className="w-full">
                League of Graphs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`https://www.deeplol.gg/summoner/euw/${gameName}-${tagLine}`} target="_blank" className="w-full">
                DeepLOL
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`https://u.gg/lol/profile/euw1/${gameName}-${tagLine}/overview`} target="_blank" className="w-full">
                U.GG
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
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
          {account.tier !== "MASTER" && account.tier !== "CHALLENGER" && account.tier !== "GRANDMASTER" && account.rank}
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
          {peakLpUpdate.tier !== "MASTER" && peakLpUpdate.tier !== "CHALLENGER" && peakLpUpdate.tier !== "GRANDMASTER" && peakLpUpdate.rank}
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
                <TooltipProvider key={update.id} delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex flex-col items-center">
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
                    </TooltipTrigger>
                    <TooltipContent>{dayjs(update.date).fromNow()}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
        </div>
      )
    }
  }
]
