const pizzaCounter = document.querySelector('.pizza-count')
const pizzaPerSecond = document.querySelector('.per-second')
const intervalTime = 100
const basicClickPower = 1
const pizzaStart = 0
const basicCPS = 0
var numberOfPizzas, cps, items, clickPower

class Game {
  constructor(numberOfPizzas, clickPower, cps, items) {
    this.numberOfPizzas = numberOfPizzas
    this.clickPower = clickPower
    this.cps = cps
    this.items = items
  }
}

class Item {
  constructor(name, price, clickBuff, cpsBuff, limit = 999, image, number = 0) {
    this.name = name
    this.price = price
    this.clickBuff = clickBuff
    this.cpsBuff = cpsBuff
    this.number = number
    this.limit = limit
    this.image = image
  }
}

function initializeNewGame() {
  numberOfPizzas = pizzaStart
  clickPower = basicClickPower
  cps = basicCPS
  items = {
    aglio: new Item('Artefakt z Aglio', 10, 0.1, 0, 100, 'url("resources/garlic-sprite.png")'),
    agrafka: new Item('Agrafka w uchu', 25, 0.3, 0, 100, 'url("resources/agrafka-sprite.png")'),
    nos: new Item('Nos do interesu', 100, 2, 0, 100, 'url("resources/nose-sprite.png")'),
    fordka: new Item('Samochód dostawczy', 200, 0, 0.2, 100, 'url("resources/fordka-sprite.png")'),
    frutti: new Item('Frutti Maestro', 500, 0.25, 1, 10, 'url("resources/frutti-sprite.png")'),
    certificato: new Item(
      'Italiano Certificato',
      1000,
      1,
      5,
      10,
      'url("resources/certificato-sprite.png")'
    ),
    dudu: new Item('Friend from Saigon', 2500, 0, 5, 1, 'url("resources/wietnam-sprite.png")'),
    boy: new Item('EBoy', 10000, 10, 10, 1, 'url("resources/boy-sprite.png")'),
  }
}

function writeScore() {
  pizzaCounter.innerText = Math.round(numberOfPizzas) + ' PIZZAS'
  pizzaPerSecond.innerText = (cps * 10).toFixed(1) + ' per second'
}

let titleScreen = document.querySelector('.title-screen')
titleScreen.addEventListener('click', () => {
  document.body.removeChild(titleScreen)
  let audio = document.createElement('div')
  let it = document.querySelectorAll('.item')
  audio.innerHTML =
    '<audio autoplay loop><source src="resources/PIZZAAA.wav" type="audio/wav">Your browser does not support the audio element.</audio>'
  document.body.appendChild(audio)
  if (localStorage.getItem('eboyGameSave') === null) initializeNewGame()
  else {
    let saveGame = JSON.parse(localStorage.getItem('eboyGameSave'))
    numberOfPizzas = saveGame.numberOfPizzas
    clickPower = saveGame.clickPower
    cps = saveGame.cps
    items = saveGame.items
  }
  let i = 0
  for (const item in items) {
    it[i].addEventListener('click', () => {
      if (
        Math.round(numberOfPizzas) >= items[item].price &&
        items[item].number < items[item].limit
      ) {
        numberOfPizzas = numberOfPizzas - items[item].price
        items[item].number++
        cps += (items[item].cpsBuff * intervalTime) / 1000
        clickPower += items[item].clickBuff
      }
      document.querySelector('.mobile-description').innerText =
        items[item].name + ' (' + items[item].price + ')'
    })
    it[i].addEventListener('mousemove', (event) => {
      let descriptionBox = document.querySelector('.description')
      descriptionBox.style.display = 'block'
      descriptionBox.style.left = event.clientX + 20 + 'px'
      descriptionBox.style.top = event.clientY + 20 + 'px'
      descriptionBox.innerText = items[item].name + ' (' + items[item].price + ')'
    })
    it[i].addEventListener('mouseout', (event) => {
      let descriptionBox = document.querySelector('.description')
      descriptionBox.style.display = 'none'
    })
    i++
  }
  setInterval(() => {
    let i = 0
    let flag = false
    let gameSave = new Game(numberOfPizzas, clickPower, cps, items)
    localStorage.setItem('eboyGameSave', JSON.stringify(gameSave))
    for (const item in items) {
      it[i].style.setProperty('--content-value', "'" + items[item].number + "'")
      if (Math.round(numberOfPizzas) >= items[item].price) {
        it[i].style.backgroundImage = items[item].image
      }
      if (items[item].number >= items[item].limit) {
        it[i].style.outline = 'solid 3px #d0d050'
        it[i].style.backgroundImage = items[item].image
        flag = true
      } else if (Math.round(numberOfPizzas) < items[item].price) {
        flag = false
        it[i].style.backgroundImage = items[item].image.replace('sprite', 'sprite-locked')
      }
      i++
    }
    if (flag) console.log('YOU WON!!!')
    numberOfPizzas = numberOfPizzas + cps
    writeScore()
  }, intervalTime)
  writeScore()
})

document.querySelector('.clickable-area').addEventListener('click', (event) => {
  numberOfPizzas = numberOfPizzas + clickPower
  let marker = document.querySelector('.marker')
  marker.innerText = '+' + clickPower.toFixed(1)
  marker.style.left = event.clientX + 50 + 'px'
  marker.style.top = event.clientY - 50 + 'px'
  marker.animate(
    [
      { transform: 'translateY(0px)', opacity: '1' },
      { transform: 'translateY(-300px)', opacity: '0' },
    ],
    {
      duration: 1000,
    }
  )
  writeScore()
})
let open = false
document.querySelector('.mobile-open').addEventListener('click', () => {
  if (open === false) {
    document.querySelector('.pizza-box').style.display = 'none'
    document.querySelector('.mobile-menu').style.display = 'block'
    document.querySelector('.mobile-open').innerText = 'CLOSE MENU'
    document.querySelector('.mobile-description').style.display = 'block'
    for (let i = 0; i < 2; i++) {
      document.querySelectorAll('.items-row')[i].style.display = 'block'
      document.querySelectorAll('.items-row')[i].style.zIndex = '110'
    }
    open = true
  } else {
    document.querySelector('.pizza-box').style.display = 'flex'
    document.querySelector('.mobile-menu').style.display = 'none'
    document.querySelector('.mobile-open').innerText = 'OPEN MENU'
    document.querySelector('.mobile-description').style.display = 'none'
    document.querySelector('.mobile-description').innerText = ''
    for (let i = 0; i < 2; i++) {
      document.querySelectorAll('.items-row')[i].style.display = 'none'
      document.querySelectorAll('.items-row')[i].style.zIndex = '1'
    }
    open = false
  }
})
