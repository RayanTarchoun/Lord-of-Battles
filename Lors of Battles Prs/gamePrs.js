async function fetchOpponentDetails() {
    try {
       
        const response = await axios.get('https://thronesapi.com/api/v2/Characters/1');
        console.log(response.data.fullName, response.data.image);
        return response.data; 
    } catch (error) {
        console.error('Failed to fetch opponent:', error);
        return null;
    }
}
 
const game = document.querySelector('.game')
 
class Game {
    static async new() {
        game.innerHTML = `
            <h2>Welcome !</h2>
            <input type="text" placeholder="Your hero's name here ...">
            <h2>Choose your profile : </h2>
            <select>
                <option value="Warrior">Warrior</option>
                <option value="Wizard">Wizard</option>
                <option value="Barbarian">Barbarian</option>
                <option value="Mercenary">Mercenary</option>
            </select>
            <button>GO</button>
        `
        const btn = document.querySelector('button')
        btn.addEventListener('click', () => {
             console.log(salut)
            const name = document.querySelector('input').value
            const profile = document.querySelector('select').value
 
            if (name.length > 0) {
                const opponentDetails =  fetchOpponentDetails()
                if (opponentDetails) {
                    game.innerHTML = "<div class=\"zone\"></div>"
 
                    const player1 = new Player(name, profile)
                    const player2 = new Player(opponentDetails.name, opponentDetails.title, opponentDetails.image)
 
                    player1.setOpponent(player2)
                    player2.setOpponent(player1)
                } else {
                    console.error('Could not fetch opponent details')
                }
            } else {
                const error = document.createElement('p')
                error.innerHTML = "<p class=\"error\" style=\"color: darkred\"><b>Please give a name to your hero !</b></p>"
                game.appendChild(error)
            }
        })
    }
 
    static newDice() {
        const random = Math.floor(Math.random() * 6) + 1
 
        const img = document.createElement('img')
        img.classList.add('dice')
 
        img.src = `./dice-assets/dice-six-faces-${random}.png`
 
        return img
    }
 
    static rollDice() {
        const zone = document.querySelector('.zone')
        let newDice = this.newDice()
 
        zone.appendChild(newDice)
 
        const interval = setInterval(() => {
            let diceImg = document.querySelector('.dice')
            let newDice = this.newDice()
 
            diceImg.src = newDice.src
        }, 80)
 
        setTimeout(() => {
            clearInterval(interval)
        }, 1500)
    }
}
 
class Player {
    constructor(name, spec, image) {
        this.name = name
        this.health = 100
        this.mana = 100
        this.spec = spec
        this.image = image // Supposant que vous souhaitez utiliser l'image quelque part
        this.opponent = null
        this.card = this.createPlayer()
    }
 
    getDetails() {
        return `${this.name} (${this.spec})`
    }
 
    attack(isAutoAttack = false) {
        if (this.mana < 10) {
            alert("Not enough mana for attack")
            return
        }
        this.mana -= 10
        this.updateStatus()
 
        Game.rollDice()
 
        setTimeout(() => {
            const zone = document.querySelector('.zone')
            const dice = document.querySelector('.dice')
            const diceFace = dice.src.slice(-5, -4)
            if (diceFace > 3) {
                zone.innerHTML += "<h2 style=\"color: darkgreen\">Attack successful !</h2>"
                if (this.opponent.health > 10) {
                    this.opponent.health -= 10
                } else {
                    this.opponent.card.innerHTML = "<h2>You are dead ...</h2>"
                }
                this.opponent.updateStatus()
                if (!isAutoAttack) {
                    this.opponent.autoAttack()
                }
            } else {
                zone.innerHTML += "<h2 style=\"color: darkred\">Attack failed</h2>";
            }
        }, 1550);
    }
 
    autoAttack() {
    setTimeout(() => {
        if (this.mana >= 10) {
            this.attack(true)
        }
    }, 2000)
}
 
specialAttack() {
    if (this.mana < 20) {
        alert("Not enough mana for special attack")
        return
    }
    this.mana -= 20
    this.updateStatus()
 
    Game.rollDice()
 
    setTimeout(() => {
        const zone = document.querySelector('.zone')
        const dice = document.querySelector('.dice')
        const diceFace = dice.src.slice(-5, -4)
        if (diceFace > 4) {
            zone.innerHTML += "<h2 style=\"color: gold\">Special Attack successful!</h2>"
            if (this.opponent.health > 20) {
                this.opponent.health -= 20
            } else {
                this.opponent.card.innerHTML = "<h2>Defeated by a Special Attack...</h2>"
            }
            this.opponent.updateStatus()
            this.opponent.autoAttack()
        } else {
            zone.innerHTML += "<h2 style=\"color: crimson\">Special Attack failed</h2>"
        }
    }, 1550)
}
 
updateStatus() {
    this.card.querySelector('.health').textContent = `Health: ${this.health}`
    this.card.querySelector('.mana').textContent = `Mana: ${this.mana}`
}
 
createPlayer() {
    const card = document.createElement('div')
    card.classList.add(`${this.name}-card`)
    card.innerHTML = `
        <h2>${this.getDetails()}</h2>
        <p class="health">Health: ${this.health}</p>
        <p class="mana">Mana: ${this.mana}</p>
        <button class="attack-btn">Attack</button>
        <button class="spec-btn">Special Attack</button>
    `
 
    const attackBtn = card.querySelector('.attack-btn')
    attackBtn.addEventListener('click', () => {
        this.attack()
    })
 
    const specBtn = card.querySelector('.spec-btn')
    specBtn.addEventListener('click', () => {
        this.specialAttack()
    })
 
    game.appendChild(card)
    return card
}
 
setOpponent(opponent) {
    this.opponent = opponent
}
}
 
Game.new()