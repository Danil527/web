var map = L.map('mapid').setView([55.8034621,37.4077102], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([55.8034302,37.4099802]).addTo(map)
    .bindPopup('МИЭМ')
    .openPopup();


let chat = document.getElementById('chat')

const answers = {
    "Привет":"Привет!",
    "Пока":"Пока!",
    "Спасибо":"Да не за что, пишите еще)",
    "Как с тобой связаться?":`Держи ссылку на мой Vk`,
    "Где ты учишься?":"Я учусь в Высшей Школе Экономики, факультет МИЭМ!",
    "За сколько гребёшь 6км?":"23:10"
}

let myVk = document.getElementById('myVk')

function generateAnswer(message, divChat) {
    let respmsg = document.createElement('p')
    respmsg.classList.add('msg')
    
    if (answers[message.innerHTML]) {
        respmsg.innerHTML = answers[message.innerHTML]
        if (answers[message.innerHTML].indexOf('Vk') != -1) {
            respmsg.innerHTML += '\n'
            respmsg.append(myVk)
        }
    }   
    else if (message.innerHTML === 'Список') {
        for (let question in answers) {
            respmsg.innerHTML += ' \"' + question + '\" <br>'
        }
            
    }
    else respmsg.innerHTML = 'Не знаю, как ответить :( Чтобы узнать список допустимых вопросов, напишите \'Список\''

    respmsg.style.backgroundColor = '#6fa0eec4'
    message.after(respmsg)
    divChat.scrollTop = divChat.scrollHeight
}

chat.onclick = (event) => {
    // Главный элемент окна
    let divWindow = document.createElement('div')
    divWindow.classList.add('chatWindow')

    // Header окна
    let divHeader = document.createElement('div')
    divHeader.classList.add('divHeader')

    // Контейнер сообщений 
    let divChat = document.createElement('div')
    divChat.classList.add('divChat')

    // Контейнер для ввода сообщений
    let divWrapper = document.createElement('div')
    divWrapper.classList.add('divWrapper')


    // Кнопка закрытия
    let btnClose = document.createElement('button')
    divHeader.append(btnClose)
    btnClose.innerHTML = 'X'
    btnClose.classList.add('btnClose')
    btnClose.onclick = (event) => {
        divWindow.remove()
        chat.disabled = false
    }

    // Поле для ввода сообщений 
    let textarea = document.createElement('textarea')
    divWrapper.append(textarea)
    textarea.classList.add('textarea')
    textarea.placeholder = 'Ваше сообщение...'

    // Обработка сообщения после нажатия "Enter"
    textarea.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            // Предотвращения действия пробела => т.е. добавления \n
            event.preventDefault()
            
            // Добавление сообщения пользователя
            let msg = document.createElement('p')
            msg.classList.add('msg')
            msg.innerHTML = textarea.value
            
            if (divChat.hasChildNodes()) divChat.lastChild.after(msg)
            else divChat.append(msg)
            textarea.value = ''

            // Скрол чата вниз
            divChat.scrollTop = divChat.scrollHeight

            // Ответ
            generateAnswer(msg, divChat)
        }
    })
    

    // Отправка голосовых
    if (navigator.mediaDevices.getUserMedia) {
        let chunks = []
        const constraints = { audio: true };

        let btnAudio = document.createElement('button')
        divWrapper.append(btnAudio)
        btnAudio.innerHTML = 'Record'
        btnAudio.classList.add('btnAudio')

        let onSuccess = (stream) => {
            const mediaRecorder = new MediaRecorder(stream)
            
            // Начало записи
            btnAudio.onclick = (event) => {
                if (mediaRecorder.state === 'inactive') {
                    mediaRecorder.start()
                    btnAudio.style.backgroundColor = 'red'
                    btnAudio.innerHTML = 'Stop'
                } else {
                    mediaRecorder.stop()
                    btnAudio.style.backgroundColor = '#5988e6'
                    btnAudio.innerHTML = 'Record'
                }
            }

            // Конец записи => сохранение и вывод в чат
            mediaRecorder.onstop = (event) => {
                let audioMsg = document.createElement('audio')
                audioMsg.setAttribute('controls', '')
                audioMsg.classList.add('audioMsg')

                if (divChat.hasChildNodes()) divChat.lastChild.after(audioMsg)
                else divChat.append(audioMsg)

                divChat.scrollTop = divChat.scrollHeight
                audioMsg.controls = true

                const blob = new Blob(chunks, {'type' : 'audio/ogg; codecs=opus'})
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob)               
                audioMsg.src = audioURL
            }

            mediaRecorder.ondataavailable = function(event) {
                chunks.push(event.data);
            }

        }
        let onError = (err) => {
            console.log('The following error occured: ' + err);
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    }   

    // Добавление всех элементов
    divWindow.append(divChat)
    divWindow.append(divHeader)
    divWindow.append(divWrapper)
    document.body.append(divWindow)

    chat.disabled = true
}
