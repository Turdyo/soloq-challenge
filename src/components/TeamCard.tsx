import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Account, Prisma } from "@prisma/client"
import Image from "next/image"

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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex w-[600px] flex-col gap-2">
          <div className="flex w-full items-center justify-between gap-4 text-muted-foreground">
            <span className="w-[240px]">Comptes</span>
            <span className="w-[110px]">Elo Actuel</span>
            <span className="w-[110px]">Peak Elo</span>
          </div>
          {accounts.map(account => {
            const [gameName, tagLine] = account.name.split("#")
            const peakLpUpdate = account.lpUpdate.reduce((acc, lpupdate) => (lpupdate.LPC > acc.LPC ? lpupdate : acc))
            return (
              <li className="flex w-full items-center justify-between gap-4" key={account.name}>
                <div className="flex w-[240px] gap-4">
                  <Image src={account.profileIcon} width={32} height={32} alt="pp" className="rounded-full" />
                  <span>
                    {gameName} <span className="text-muted-foreground">#{tagLine}</span>
                  </span>
                </div>
                <div className="flex w-[110px] items-center gap-2">
                  <Image
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${account.tier?.toLowerCase()}.png`}
                    width={30}
                    height={30}
                    alt={account.tier!}
                  />
                  {account.rank}
                  <span className="ml-auto">
                    {account.LP} <span className="text-muted-foreground">LP</span>
                  </span>
                </div>
                <div className="flex w-[110px] items-center gap-2">
                  <Image
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${peakLpUpdate.tier?.toLowerCase()}.png`}
                    width={30}
                    height={30}
                    alt={peakLpUpdate.tier!}
                  />
                  {peakLpUpdate.rank}
                  <span className="ml-auto">
                    {peakLpUpdate.LP} <span className="text-muted-foreground">LP</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
