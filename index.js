const { default: puppeteer } = require('puppeteer')

const scrapper = async (url) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(url)

  const classImg = await page.$$('img.js_preview_image')
  const classtitle = await page.$$('a.product_preview-title')
  const classPrice = await page
    .$$('span.price-sale', { timeout: 60000 })
    .catch(() => [])

  const imgSrc = []
  const titleText = []
  const priceText = []

  for (let i = 0; i < 10; i++) {
    const imgElement = classImg[i]
    imgSrc.push(await imgElement.evaluate((e) => e.getAttribute('src')))

    const titleElement = classtitle[i]
    titleText.push(await titleElement.evaluate((e) => e.getAttribute('title')))

    let currentPriceText = ''
    if (i < classPrice.length) {
      const priceElement = classPrice[i]
      currentPriceText = await priceElement.evaluate((e) => e.textContent)
    }
    priceText.push(currentPriceText)
  }

  const itemData = []

  for (let i = 0; i < 10; i++) {
    const currentItem = {
      imgSrc: imgSrc[i],
      titleText: titleText[i],
      priceText: priceText[i]
    }

    itemData.push(currentItem)
  }

  console.log(itemData)

  await browser.close()
}
module.exports = { scrapper }
scrapper('https://www.elcorteingles.es/electronica/ordenadores/portatiles/')
