import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Account, Prisma } from "@prisma/client"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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
  return (
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
  )
}
