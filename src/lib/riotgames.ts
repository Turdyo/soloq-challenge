import { Rank, Tier } from "@prisma/client"

const RIOT_API_KEY = process.env.RIOT_API_KEY

interface AccountDto {
  puuid: string
  gameName: string
  tagLine: string
}

interface AccountByPuuid {
  id: string
  accountId: string
  puuid: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
  name: string
}

interface RankedInfoResponse {
  leagueId: string
  queueType: "RANKED_SOLO_5x5" | "RANKED_FLEX_SR"
  tier: Tier
  rank: Rank
  summonerId: string
  leaguePoints: number
  wins: number
  losses: number
  veteran: boolean
  inactive: boolean
  freshBlood: boolean
  hotStreak: boolean
}

export async function fetchAccountPuuidByName(gameName: string, tagLine: string): Promise<AccountDto> {
  return (
    await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}/?api_key=${RIOT_API_KEY}`,
      {
        cache: "no-store"
      }
    )
  ).json()
}

export async function fetchAccountByPuuid(puuid: string) {
  // Make request to the first endpoint
  const summonerResponse = await (
    await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}/?api_key=${RIOT_API_KEY}`, {
      cache: "no-store"
    })
  ).json()

  // Make request to the second endpoint
  const accountResponse = (await (
    await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`, {
      cache: "no-store"
    })
  ).json()) as AccountDto

  // Extract necessary data from responses
  const summonerData = summonerResponse
  const accountData = accountResponse

  // Merge data from both responses
  const mergedData = {
    ...summonerData,
    name: accountData.gameName + "#" + accountData.tagLine
  }

  return mergedData as AccountByPuuid
}

export async function fetchRankedInfo(id: string): Promise<RankedInfoResponse[]> {
  return (
    await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${RIOT_API_KEY}`, {
      cache: "no-store"
    })
  ).json()
}
