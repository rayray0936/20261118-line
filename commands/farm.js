import axios from 'axios'
import templateFarm from '../templates/farn-ex.js'
import fs from 'node:fs'

export default async (event) => {
  try {
    const { data } = await axios.get(
      'https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvAttractions.aspx?IsTransData=1&UnitId=192',
    )
    const bubbles = data
      .filter((value) => {
        return value.Name.includes(event.message.text.replace('查農場', '').trim())
      })
      .slice(0, 3)
      .map((value) => {
        return templateFarm(value)
      })

    if (bubbles.length === 0) {
      await event.reply('找不到相關資料')
      return
    }

    const result = await event.reply({
      type: 'flex',
      altText: '農場查詢結果',
      contents: {
        type: 'carousel',
        contents: bubbles,
      },
    })
    if (result.message && process.env.DEBUG) {
      console.log(result)
      fs.writeFile('./dump/flex.json', JSON.stringify(bubbles, null, 2), () => {})
    }
  } catch (error) {
    console.error(error)
  }
}
