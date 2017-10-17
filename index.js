"use strict";

let WSServer = new require('ws');
let port = process.env.PORT || 8081;
let wsServer = new WSServer.Server({
    port: port
});

// подключенные клиенты
let clients = {};

// счётчик для генерации имён клиентов
let nameCounter = 1;

// функция для вывода всех клиентов в консоль
function writeAllClients() {

    let s = "Clients: ";
    for (let key in clients) {
        s += (key + " ");
    }
    console.log(s);


    wsServer.on("connection", function (ws) {

        // получаем имя клиента
        let id = "id_" + nameCounter;
        // увеличиваем счётчик
        nameCounter++;
        // сохраняем имя клиента в массив
        clients[id] = ws;
        // выводим информацию о добавлении нового клиента
        console.log("новое соединение " + id);
        // выводим всех клиентов в консоль
        writeAllClients();
        // событие при получении сообщения
        ws.on("message", function (message) {
        // выводим в консоль текст сообщения и id его отправителя
            console.log("получено сообщение " + message + " от " + id);
            // отсылаем сообщение абсолютно всем пользователям
            for (let key in clients) {
                clients[key].send(message);
            }
            // отсылаем личное сообщение отправителю
            clients[id].send("ЛИЧНОЕ " + message)
        });


        // событие при закрытии соединения
        ws.on("close", function () {
            // выводим информацию о закрытом соединении
            console.log('соединение закрыто ' + id);
            // удаляем пользователя
            delete clients[id];
            // выводим всех клиентов в консоль
            writeAllClients();
        });
    });
}