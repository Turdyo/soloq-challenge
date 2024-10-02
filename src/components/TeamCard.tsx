import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Account } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type Props = {
  title: string
  description: string
  accounts: Account[]
}

export function TeamCard({ title, description, accounts }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-1">
          {accounts.map(account => {
            const [gameName, tagLine] = account.name.split("#")
            return (
              <li className="flex w-full items-center gap-4 justify-between" key={account.name}>
                <Link
                  className="flex gap-4"
                  target="_blank"
                  href={`https://op.gg/summoners/euw/${account.name.replace("#", "-")}`}
                >
                  <Image src={account.profileIcon} width={32} height={32} alt="pp" className="rounded-full" />
                  <span>
                    {gameName} <span className="text-muted-foreground">#{tagLine}</span>
                  </span>
                </Link>
                <div className="flex gap-2 items-center">
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
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
