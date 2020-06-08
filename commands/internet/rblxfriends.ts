import { Message } from 'discord.js'
import fetch from 'node-fetch'
interface Player {
  Id: number
  Username: string
  IsOnline: boolean
}
export const run = async (message: Message, args: string[]) => {
  if (!args.join('').length) {
    return {
      embed: {
        author: {
          name: 'Error!'
        },
        title: 'Please provide a username!',
        color: 'RED'
      }
    }
  }
  const { Id: id, IsOnline }: Player = await fetch(
    'https://api.roblox.com/users/get-by-username?username=' +
      encodeURIComponent(args.join(' '))
  ).then(res => res.json())
  if (!id) {
    return {
      embed: {
        author: {
          name: 'Error!'
        },
        title: "That player couldn't be found!",
        color: 'RED'
      }
    }
  }
  const friendarray: Player[] = await fetch(
    `https://api.roblox.com/users/${id}/friends`
  ).then(res => res.json())
  if (!friendarray) {
    return {
      embed: {
        author: {
          name: 'Error!'
        },
        title: 'There was a problem getting the list of friends',
        color: 'RED'
      }
    }
  }
  const fields = friendarray.map(friend => {
    return {
      name: friend.Username,
      value: friend.IsOnline ? '🟢 Online' : '🔴 Offline',
      inline: true
    }
  })
  return {
    embed: {
      author: {
        name: args.join(' ') + IsOnline ? ' (🟢 Online)' : ' (🔴 Offline)',
        iconURL: `https://roblox.com/Thumbs/Avatar.ashx?x=420&y=420&username=${encodeURIComponent(
          args.join(' ')
        )}`,
        url: `https://www.roblox.com/users/${id}/`
      },
      fields
    }
  }
}
export const desc = 'username -> info'
