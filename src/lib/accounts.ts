import { Rank, Tier } from "@prisma/client"
import { fetchAccountByPuuid, fetchAccountPuuidByName, fetchRankedInfo } from "./riotgames"
import { getProfileIconUrl } from "./utils"
import db from "./prisma"

export async function registerAccount(gameName: string, tagLine: string, discordId: string) {
  const accountPuuid = await fetchAccountPuuidByName(gameName, tagLine)
  const accountData = await fetchAccountByPuuid(accountPuuid.puuid)

  return db.account.upsert({
    where: { id: accountData.id },
    create: {
      id: accountData.id,
      puuid: accountData.puuid,
      name: accountPuuid.gameName + "#" + accountPuuid.tagLine,
      profileIcon: getProfileIconUrl(accountData.profileIconId),
      sumonerLvl: accountData.summonerLevel,
      player: { connect: { discordId } }
    },
    update: {
      puuid: accountData.puuid,
      name: accountPuuid.gameName + "#" + accountPuuid.tagLine,
      profileIcon: getProfileIconUrl(accountData.profileIconId),
      sumonerLvl: accountData.summonerLevel,
      player: { connect: { discordId } }
    }
  })
}

export async function fetchAccountData(accountId: string) {
  const rankedInfo = (await fetchRankedInfo(accountId)).find(league => league.queueType === "RANKED_SOLO_5x5")

  if (!rankedInfo) return

  const userAccount = await db.account.findUnique({ where: { id: accountId } })
  const oldLPC = userAccount?.LPC ?? 0
  const newLPC = getLPC(rankedInfo.tier, rankedInfo.rank, rankedInfo.leaguePoints)
  const diff = oldLPC !== 0 ? newLPC - oldLPC : 0

  if (newLPC !== 0 && oldLPC !== newLPC) {
    await db.lpUpdate.create({
      data: {
        LPC: newLPC,
        date: new Date().toISOString(),
        LP: rankedInfo.leaguePoints,
        rank: rankedInfo.rank,
        tier: rankedInfo.tier,
        lastUpdateDiff: Math.abs(diff) < 100 ? diff : 0, // prevent new seasons reset
        account: {
          connect: {
            id: accountId
          }
        }
      }
    })
  }

  if (userAccount?.puuid) {
    const newUserAccount = await fetchAccountByPuuid(userAccount.puuid)

    return db.account.update({
      where: { id: accountId },
      data: {
        name: newUserAccount.name,
        profileIcon: getProfileIconUrl(newUserAccount.profileIconId),
        sumonerLvl: newUserAccount.summonerLevel,
        wins: rankedInfo.wins,
        losses: rankedInfo.losses,
        tier: rankedInfo.tier,
        rank: rankedInfo.rank,
        LP: rankedInfo.leaguePoints,
        LPC: newLPC
      }
    })
  }
  return db.account.update({
    where: { id: accountId },
    data: {
      wins: rankedInfo.wins,
      losses: rankedInfo.losses,
      tier: rankedInfo.tier,
      rank: rankedInfo.rank,
      LP: rankedInfo.leaguePoints,
      LPC: newLPC
    }
  })
}

function getLPC(tier: Tier, rank: Rank, LP: number) {
  if (tier === Tier.MASTER || tier === Tier.GRANDMASTER || tier === Tier.CHALLENGER) {
    return TierLPC[tier] + LP
  } else {
    return TierLPC[tier] + RankLPC[rank] + LP
  }
}

enum TierLPC {
  UNRANKED = 0,
  IRON = 0,
  BRONZE = 400,
  SILVER = 800,
  GOLD = 1200,
  PLATINUM = 1600,
  EMERALD = 2000,
  DIAMOND = 2400,
  MASTER = 2800,
  GRANDMASTER = 2800,
  CHALLENGER = 2800
}

enum RankLPC {
  IV = 0,
  III = 100,
  II = 200,
  I = 300
}
