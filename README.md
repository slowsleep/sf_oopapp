# Учебный проект Kanban-доска

Реализовано создание задачи, перемещение задачи в другой блок и изменение его статуса (из backlog в ready, из ready в in-progress, из in-progress в finished). Изменять статус задачи можно через dropdown меню при нажатии на кнопку "+ Add card", либо через перемещание задачи при помощи drag'n'drop.

### Карта сайта:

/ - главная страница с kanban-доской

/profile - страница с данными залогиненного пользователя

/users - страница только для администртора со список всех пользоваталей и возможностью из удаления

### Роли пользователей:
- администратор
- пользователь

### Возможности пользователей по ролям:
- администратор:
    - создавать, удалять пользователей
    - видеть все задачи, всех пользователей
    - редактировать, удалять все задачи
- пользователь:
    - создавать, редактировать, удалять свои собственые задачи

### Тестовые пользователи
1.
    login: admin

    password: admin123

2.
    login: test

    password: qwerty123


## Как запустить проект:
`npm install`

`npm update`

`npm run start`


## Технологии:
- HTML
- CSS (Sass)
- JS
- Bootstrap 5
- Webpack 5

