const botCheck = document.querySelector('#bot_check')
const submit = document.querySelector('#button')
let bot_node = document.createElement('p')

botCheck.addEventListener('change', (event) => {
    if (event.target.attributes.id.value != 'opt2') {
        if (!botCheck.contains(bot_node)) {
            bot_node.innerHTML = 'Ответ неверный!'
            bot_node.style.color = 'red'
            botCheck.append(bot_node)
            submit.disabled = true
        }
    } else {
        botCheck.removeChild(bot_node)
        submit.disabled = false
    }
})