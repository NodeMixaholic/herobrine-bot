const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin

const bot = mineflayer.createBot({
  host: 'localhost', // minecraft server ip
  username: 'Herobrine', // minecraft username
  //password: '12345678' // minecraft password, comment out if you want to log into online-mode=false servers
  port: 35459,                // only set if you need a port that isn't 25565
  version: "1.17.1",             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // auth: 'mojang'              // only set if you need microsoft auth, then set this to 'microsoft'
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)

bot.on('chat', (username, message) => {
    if (username === bot.username) return
    const msg = message.toLowerCase()
    if (msg.includes("herobrine") && (msg.includes("isn't real") || msg.includes("is not real"))) {
        bot.chat("Then how am I responding? You're next. >:)")
    }
})

bot.once('spawn', () => {
    console.log("Spawned.")
    //mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
    //console.log("Started view server on port 3007.")
})
bot.on('physicsTick', () => {
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)
    let x = Math.random() * ((Math.random() * 10) * 100)
    let y = Math.random() * ((Math.random() * 10) * 100)
    let z = Math.random() * ((Math.random() * 10) * 100)
    const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 && e.mobType !== 'Armor Stand'
    const entity = bot.nearestEntity(filter)
    if (entity) {
        // Start attacking
        bot.pvp.attack(entity)
    }
    bot.pathfinder.setGoal(new GoalNear(x,y,z,100))
})
// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)