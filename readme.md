# Todo back-end

<div align="center"></br>
  <img alt="Typescript badge" src="https://img.shields.io/badge/Typescript-00B1EA?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="NodeJS badge" src="https://img.shields.io/badge/Node.js-90C53F?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="API badge" src="https://img.shields.io/badge/API%20REST-E64D80?style=for-the-badge" />
  <img alt="ExpressJS badge" src="https://img.shields.io/badge/Express.js-333331?style=for-the-badge" />
  <img alt="TypeORM badge" src="https://img.shields.io/badge/TYPEORM-DD3222?style=for-the-badge" />
</div></br>

Aplicação feita em typescript, com o objetivo de demonstrar minhas habilidades com TS. Essa API REST é capaz de armazenar tarefas de cada usuário individualmente, fazendo possível agendar e visualizar objetivos diariamente, semanalmente e mensalmente. A aplicação é um CRUD em si, capaz de criar, consultar, alterar e deletar dados. Feita utilizando boas práticas e tecnologias muito usadas hoje em dia.

### Todo endpoints

- **Autenticação**
	- [**Criar conta**](#signup)
	- [**Fazer Login**](#signin)
	- [**Obter novo token de acesso**](#refresh-token)
</br>

- **Usuário**
	- [**Obter informações**](#get-user-info)
	- [**Deletar**](#delete-user)
</br>

- **Tarefas**
	- **Manipulação**
		- [**Criar nova tarefa**](#new-task)
		- [**Atualizar tarefa**](#update-task)
		- [**Deletar tarefa**](#delete-task)
		</br>

	- **Consultas**
		- [**Por ID**](#get-task-by-id)
		- [**Por dia**](#get-tasks-of-the-day)
		- [**Por mês**](#get-tasks-of-the-month)
		- [**Por ano**](#get-tasks-of-the-year)
		- [**Estatisticas**](#get-tasks-statistics)

# Iniciando
    > npm start

Caso tudo ocorra com sucesso a saida deverá ser:

    [OK] API IS RUNNING AT http://back-end-host:3000

    [OK] CONNECTION TO DATABASE SUCCESSFUL

# Autenticação
## SignUp

Criar uma conta na aplicação.

| Rota          | Método     | Autenticação |
|---------------|------------|--------------|
| **`/signup`** | **`POST`** | **`NÃO`**    |


**Parâmetros obrigatórios**

| Campo           | Tipo         | Local | Descrição                |
|-----------------|--------------|-------|--------------------------|
| **`firstname`** | **`string`** | body  | Primeiro nome do usuário |
| **`lastname`**  | **`string`** | body  | Ultimo nome do usuário   |
| **`email`**     | **`string`** | body  | Endereço de e-mail       |
| **`password`**  | **`string`** | body  | Senha da nova conta      |

**Exemplo de requisição**

**`POST`** **`/signup`**

```json
{
	"firstname": "Felipe",
	"lastname": "Dasr",
	"email": "felipedasr@email.com",
	"password": "strongpassword"
}
```

**Resposta de sucesso**

**Código**: **`201 CREATED`**

```json
{
	"id": "4f2bdf94-6438-4495-a3fb-1b6f2adba0df",
	"firstname": "Felipe",
	"lastname": "Dasr",
	"email": "felipedasr@email.com",
	"createdAt": "2022-04-28T23:48:14.491Z",
	"updatedAt": "2022-04-28T23:48:14.491Z"
}
```

Logo depois do usuário ser criado, um e-mail de boas vindas será enviado a ele.

### E-mail de boas vindas:
![welcome_message](docs/images/welcomeMessage.PNG)

## SignIn

Fazer login na conta para receber um token de acesso.

| Rota          | Método     | Autenticação |
|---------------|------------|--------------|
| **`/signin`** | **`POST`** | **`NÃO`**    |


**Parâmetros obrigatórios**

| Campo          | Tipo         | Local | Descrição         |
|----------------|--------------|-------|-------------------|
| **`email`**    | **`string`** | body  | E-mail do usuário |
| **`password`** | **`string`** | body  | Senha do usuário  |

**Exemplo de requisição**

**`POST`** **`/signin`**

```json
{
	"email": "felipedasr@gmail.com",
	"password": "strongpassword"
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"user": {
		"id": "4f2bdf94-6438-4495-a3fb-1b6f2adba0df",
		"firstname": "Felipe",
		"lastname": "Dasr",
		"email": "felipedasr@email.com",
		"createdAt": "2022-04-28T23:48:14.491Z",
		"updatedAt": "2022-04-28T23:48:14.491Z"
	},
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmMmJkZjk0LTY0MzgtNDQ5NS1hM2ZiLTFiNmYyYWRiYTBkZiIsImlhdCI6MTY1MTUzNDA3MiwiZXhwIjoxNjUxNjIwNDcyfQ.XNn3VK3M2iEQsRtgwSNLt4q8GE9EKtrXnNtYkKfj5Sw",
	"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmMmJkZjk0LTY0MzgtNDQ5NS1hM2ZiLTFiNmYyYWRiYTBkZiIsImlhdCI6MTY1MTUzNDA3MiwiZXhwIjoxNjU0MTI2MDcyfQ.3R_OljyA4xgvnh0Dybk1x6mAYqvpyGCtW_9sXgLZSLg"
}
```

O **`accessToken`** tem validade de `24 horas`, enquanto o **`refreshToken`** tem validade de `30 dias`.

## Refresh Token

Pedir um novo token de acesso para aplicação.

| Rota                 | Método     | Autenticação |
|----------------------|------------|--------------|
| **`/refresh-token`** | **`POST`** | **`NÃO`**    |

**Parâmetros obrigatórios**

| Campo              | Tipo         | Local | Descrição                     |
|--------------------|--------------|-------|-------------------------------|
| **`refreshToken`** | **`string`** | body  | Refresh Token recebido da API |

Existe um **`Rate Limit`** para essa rota, é possível fazer apenas `1` requisição por `minuto`.

**Exemplo de requisição**

**`POST`** **`/refresh-token`**

```json
{
	"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMwZmExYTNmLWMzOTYtNDkxYS04M2E5LTcxNzk3MGI5MzIyMSIsImlhdCI6MTY1MTU5NTA0NSwiZXhwIjoxNjU0MTg3MDQ1fQ.KQ4R4trB_yAKdrzBMc8hKROgKGjM2ISEATIDwlUjrq8"
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0MzA0MGE4LWJkMzgtNDhhOS04MjA5LTY0ZDYxMzk2Y2M0ZiIsImlhdCI6MTY1MTg4NjMwNSwiZXhwIjoxNjUxOTcyNzA1fQ.co8v8jnDHp5LKQqFVRgWcNMpZ1lbqMNTiIipuuekipk",
	"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0MzA0MGE4LWJkMzgtNDhhOS04MjA5LTY0ZDYxMzk2Y2M0ZiIsImlhdCI6MTY1MTg4NjMwNSwiZXhwIjoxNjU0NDc4MzA1fQ.G1VYQ90jNbdZwR2Kt3HOjwv-HfFXs6OiALEoLlpV4t4"
}
```
---
# Recuperção de senha

## Check if the email exists

Checar se o e-mail está cadastrado na aplicação, para que seja possível enviar um e-mail de verificação ao usuário.

| Rota                | Método    | Autenticação |
|---------------------|-----------|--------------|
| **`/email-exists`** | **`GET`** | **`NÃO`**    |

**Parâmetros obrigatórios**

| Campo       | Tipo         | Local | Descrição                            |
|-------------|--------------|-------|--------------------------------------|
| **`email`** | **`string`** | query | E-mail do usuário para a verificação |

**Exemplo de requisição**

**`GET`** **`/email-exists?email=felipedasr%40email.com`**

**`Query`**
```json
{
	"email": "felipedasr@email.com"
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

O retorno será um valor booleano dentro do campo `exists`, informando se existe ou não.

```json
{
	"exists": true
}
```

## Forgot Password

Enviar e-mail para o usuário com um código, para que ele consiga recuperar sua senha.

| Rota                   | Método     | Autenticação |
|------------------------|------------|--------------|
| **`/forgot-password`** | **`POST`** | **`NÃO`**    |

**Parâmetros obrigatórios**

| Campo       | Tipo         | Local | Descrição                                     |
|-------------|--------------|-------|-----------------------------------------------|
| **`email`** | **`string`** | body  | E-mail do usuário para a recuperação da conta |

**Exemplo de requisição**

**`POST`** **`/forgot-password`**

```json
{
	"email": "felipedasr@email.com"
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"message": "Success, an email with the verification code, has been sent to: felipedasr@email.com"
}
```

Logo após a requisição ser enviada, um e-mail será mandado ao e-mail para que o usuário possa pegar o código de recuperação.

#### E-mail de recuperação da senha

![forgot_password_email](docs/images/forgotPassword.PNG)

</br>

## Check that the password reset code is correct

Rota para checar se o código de recuperação de senha está correto.

| Rota                                  | Método    | Autenticação |
|---------------------------------------|-----------|--------------|
| **`/password-reset-code/is-correct`** | **`GET`** | **`NÃO`**    |

**Parâmetros obrigatórios**

| Campo       | Tipo         | Local | Descrição                                     |
|-------------|--------------|-------|-----------------------------------------------|
| **`email`** | **`string`** | query | E-mail do usuário para a recuperação da conta |
| **`code`**  | **`string`** | query | Código recebido no e-mail                     |

**Exemplo de requisição**

**`GET`** **`/password-reset-code/is-correct?email=felipedasr%40email.com&code=53454`**

**`Query`**
```json
{
	"email": "felipedasr@email.com",
	"code": "53454"
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

O retorno será um valor booleano dentro do campo `isCorrect`, informando se o código é correto ou não.

```json
{
	"isCorrect": true
}
```

## Change Password

Alterar a senha do usuário.

| Rota                   | Método     | Autenticação |
|------------------------|------------|--------------|
| **`/change-password`** | **`POST`** | **`NÃO`**    |

**Parâmetros obrigatórios**

| Campo             | Tipo         | Local | Descrição                                     |
|-------------------|--------------|-------|-----------------------------------------------|
| **`email`**       | **`string`** | body  | E-mail do usuário para a recuperação da conta |
| **`code`**        | **`string`** | body  | Código recebido no e-mail                     |
| **`newPassword`** | **`string`** | body  | Nova senha                                    |

**Exemplo de requisição**

**`POST`** **`/change-password`**

```json
{
	"email": "felipedasr@email.com",
	"code": "53454",
	"newPassword": "newStrongPassword"
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"message": "Successful password change"
}
```

---

# Tarefas

## New Task

Criar uma nova tarefa.

| Rota        | Método     | Autenticação |
|-------------|------------|--------------|
| **`/task`** | **`POST`** | **`SIM`**    |

**Parâmetros**

| Campo             | Tipo         | Local | Descrição                               | Obrigatório | Default |
|-------------------|--------------|-------|-----------------------------------------|-------------|---------|
| **`title`**       | **`string`** | body  | Título da tarefa                        | **`SIM`**   |         |
| **`description`** | **`string`** | body  | Descrição sobre a terefa                | **`NÃO`**   | `NULL`  |
| **`priority`**    | **`string`** | body  | Prioridade da tarefa                    | **`NÃO`**   | `1`     |
| **`dueDate`**     | **`Date`**   | body  | Até quando a tarefa deverá estar pronta | **`SIM`**   |         |
| **`done`**        | **`string`** | body  | Se foi concluida ou não                 | **`NÃO`**   | `false` |

A prioridade é dividida em 3.

**`LOW` `1`**, **`MEDIUM` `2`** e **`HIGHT` `3`**

</br>

**Exemplo de requisição**

**`POST`** **`/task`**

```json
{
	"title": "My first task",
	"description": "This is my first task.",
	"dueDate": "2022-06-03T00:00:00.000Z"
}
```

**Resposta de sucesso**

**Código**: **`201 CREATED`**

```json
{
	"taskId": "f5457a7b-998a-4963-a7b9-d6585da7cbcb",
	"title": "My first task",
	"description": "This is my first task.",
	"priority": 1,
	"done": false,
	"dueDate": "2022-06-03T00:00:00.000Z",
	"createdAt": "2022-05-07T19:27:08.743Z",
	"updatedAt": "2022-05-07T19:27:08.743Z"
}
```

## Get task by id

Obter um tarefa pelo ID.

| Rota                | Método    | Autenticação |
|---------------------|-----------|--------------|
| **`/task/:taskId`** | **`GET`** | **`SIM`**    |

**Parâmetros obrigatórios**

| Campo         | Tipo              | Local | Descrição    |
|---------------|-------------------|-------|--------------|
| **`:taskId`** | **`UUID string`** | url   | Id da tarefa |

**Exemplo de requisição**

**`GET`** **`/task/f5457a7b-998a-4963-a7b9-d6585da7cbcb`**

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"taskId": "f5457a7b-998a-4963-a7b9-d6585da7cbcb",
	"title": "My first task",
	"description": "This is my first task.",
	"priority": 1,
	"done": false,
	"dueDate": "2022-06-03T00:00:00.000Z",
	"createdAt": "2022-05-07T19:27:08.743Z",
	"updatedAt": "2022-05-07T19:27:08.743Z"
}
```

## Query parameters

Parâmetros opcionais, que podem ser incluidas nas consultas.

**Parâmetros (Opcionais)**

| Campo                 | Tipo          | Local | Descrição                        | default      |
|-----------------------|---------------|-------|----------------------------------|--------------|
| **`priorityOrder`**   | **`string`**  | query | Ordenaão por prioridade          | `ASC`        |
| **`onlyIncompleted`** | **`boolean`** | query | Pegar apenas tarefas incompletas | `false`      |
| **`limit`**           | **`integer`** | query | Limite por página                | `50`         |
| **`page`**            | **`integer`** | query | Pagina dos dados                 | `1`          |
| **`date`**            | **`Date`**    | query | Data                             | `New Date()` |

As ordenações possuem 2 valores `ASC` e `DESC`.

## Get tasks of the day

Pegar tarefas do dia atual, ou de o outro dia, porém para pegar de outro dia, o parâmetro `date` deverá ser enviado.

| Rota                    | Método    | Autenticação |
|-------------------------|-----------|--------------|
| **`/tasks_of_the_day`** | **`GET`** | **`SIM`**    |

**Exemplo de requisição**

**`GET`** **`/tasks_of_the_day?date=2022-06-03`**

**`Query`**
```json
{
	"date": "2022-06-03T00:00:00.000Z"
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"tasks": [
		{
			"taskId": "426c7687-d532-4cb1-8e70-45b1efe19e34",
			"title": "My second task",
			"description": "This is my second task",
			"priority": 1,
			"done": false,
			"dueDate": "2022-06-03T00:00:00.000Z",
			"createdAt": "2022-05-08T02:33:00.868Z",
			"updatedAt": "2022-05-08T02:33:00.868Z"
		},
		{
			"taskId": "f5457a7b-998a-4963-a7b9-d6585da7cbcb",
			"title": "My first task",
			"description": "This is my first task.",
			"priority": 1,
			"done": false,
			"dueDate": "2022-06-03T00:00:00.000Z",
			"createdAt": "2022-05-07T19:27:08.743Z",
			"updatedAt": "2022-05-07T19:27:08.743Z"
		}
	],
	"totalRecords": 2
}
```

## Get tasks of the month

Pegar tarefas do mês atual, ou de o outro mês, porém para pegar de outro mês, o parâmetro `date` deverá ser enviado.

| Rota                      | Método    | Autenticação |
|---------------------------|-----------|--------------|
| **`/tasks_of_the_month`** | **`GET`** | **`SIM`**    |

**Exemplo de requisição**

**`GET`** **`/tasks_of_the_month?date=2022-05-02`**

**`Query`**
```json
{
	"date": "2022-05-10T00:00:00.000Z"
}
```

**Resposta de requisição**

**Código**: **`200 OK`**

Dentro do campo tasks contem os dias e suas tarefas.

```json
{
	"tasks": {
		"2022-05-08": [
			{
				"taskId": "d81fd45f-2b6c-4686-a89b-2bf93fdfc682",
				"title": "My task -1",
				"description": "This is task -1.",
				"priority": 1,
				"done": false,
				"dueDate": "2022-05-09T00:00:00.000Z",
				"createdAt": "2022-05-08T01:23:15.749Z",
				"updatedAt": "2022-05-08T01:23:15.749Z"
			}
		]
	},
	"totalRecords": 1
}
```

## Get tasks of the year

Pegar tarefas do ano atual, ou de o outro ano, porém para pegar de outro ano, o parâmetro `date` deverá ser enviado.

| Rota                     | Método    | Autenticação |
|--------------------------|-----------|--------------|
| **`/tasks_of_the_year`** | **`GET`** | **`SIM`**    |

**Parâmetro opcional**
| Campo           | Tipo          | Local | Descrição                                    | Defaut  |
|-----------------|---------------|-------|----------------------------------------------|---------|
| **`pastTasks`** | **`boolean`** | query | Pegar tarefas anteriores da data da consulta | `false` |

**Exemplo de requisição**

**`GET`** **`/tasks_of_the_year?date=2022-01-02&pastTasks=true&limit=10`**

**`Query`**
```json
{
    "date": "2022-01-04T01:23:15.749Z",
    "pastTasks": true,
    "limit": 10
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

Dentro do campo `tasks` contem os meses, dentro dos meses os dias e suas tarefas respectivamente.

```json
{
	"tasks": {
		"4": {
			"2022-05-08": [
				{
					"taskId": "d81fd45f-2b6c-4686-a89b-2bf93fdfc682",
					"title": "My task -1",
					"description": "This is task -1.",
					"priority": 1,
					"done": false,
					"dueDate": "2022-05-09T00:00:00.000Z",
					"createdAt": "2022-05-08T01:23:15.749Z",
					"updatedAt": "2022-05-08T01:23:15.749Z"
				}
			]
		},
		"5": {
			"2022-06-06": [
				{
					"taskId": "0cea1916-bfbb-4fc7-8597-cf6f908ac589",
					"title": "My task 2",
					"description": "This is my task 2.",
					"priority": 1,
					"done": false,
					"dueDate": "2022-06-07T00:00:00.000Z",
					"createdAt": "2022-05-07T19:35:48.359Z",
					"updatedAt": "2022-05-08T01:04:33.652Z"
				}
			],
			"2022-06-04": [
				{
					"taskId": "62185d91-c479-497f-9989-d9615eb5c166",
					"title": "My task 3",
					"description": "This is my task 1.5.",
					"priority": 2,
					"done": false,
					"dueDate": "2022-06-05T00:00:00.000Z",
					"createdAt": "2022-05-07T19:35:57.338Z",
					"updatedAt": "2022-05-08T01:04:33.656Z"
				}
			],
			"2022-06-02": [
				{
					"taskId": "f5457a7b-998a-4963-a7b9-d6585da7cbcb",
					"title": "My first task",
					"description": "This is my first task.",
					"priority": 1,
					"done": false,
					"dueDate": "2022-06-03T00:00:00.000Z",
					"createdAt": "2022-05-07T19:27:08.743Z",
					"updatedAt": "2022-05-07T19:27:08.743Z"
				}
			]
		}
	},
	"totalRecords": 4
}
```

## Get tasks statistics

Pegar uma visão geral sobre as tarefas.

| Rota                       | Método    | Autenticação |
|----------------------------|-----------|--------------|
| **`/task/delete/:taskId`** | **`GET`** | **`SIM`**    |

**Exemplo de requisição**

**`GET`** **`/tasks-stats`**

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"tasks": 6,
	"completedTasks": 2,
	"lateTasks": 0,
	"percentageOfCompletedTasks": 33.333333333333336,
	"percentageOfLateTasks": 0
}
```

## Update task

Atualizar tarefa.

| Rota               | Método      | Autenticação |
|--------------------|-------------|--------------|
| **`/task/update`** | **`PATCH`** | **`SIM`**    |

**Parâmetros**

| Campo             | Tipo              | Local | Descrição                               | Obrigatório |
|-------------------|-------------------|-------|-----------------------------------------|-------------|
| **`taskId`**      | **`UUID string`** | body  | Id da tarefa                            | **`SIM`**   |
| **`title`**       | **`string`**      | body  | Título da tarefa                        | **`NÃO`**   |
| **`description`** | **`string`**      | body  | Descrição sobre a terefa                | **`NÃO`**   |
| **`priority`**    | **`string`**      | body  | Prioridade da tarefa                    | **`NÃO`**   |
| **`dueDate`**     | **`Date`**        | body  | Até quando a tarefa deverá estar pronta | **`NÃO`**   |
| **`done`**        | **`string`**      | body  | Se foi concluida ou não                 | **`NÃO`**   |

**Exemplo de requisição**

**`PATCH`** **`/task/update`**

```json
{
	"taskId": "d81fd45f-2b6c-4686-a89b-2bf93fdfc682",
	"description": "This is task -1. (DONE)",
	"done": true
}
```

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"message": "Successful task update"
}
```

## Delete task

Exluir um task.

| Rota               | Método    | Autenticação |
|--------------------|-----------|--------------|
| **`/tasks-stats`** | **`GET`** | **`SIM`**    |

**Parâmetro obrigatório**

| Campo        | Tipo              | Local | Descrição    |
|--------------|-------------------|-------|--------------|
| **`taskId`** | **`UUID string`** | body  | Id da tarefa |

**Exemplo de requisição**

**`DELETE`** **`/task/delete/426c7687-d532-4cb1-8e70-45b1efe19e34`**

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"message": "Successful task deletion"
}
```
---

# Usuário

## Get user info

Pegar informações sobre o usuário.

| Rota        | Método    | Autenticação |
|-------------|-----------|--------------|
| **`/user`** | **`GET`** | **`SIM`**    |

**Exemplo de requisição**

**`GET`** **`/user`**

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"user": {
		"id": "4f2bdf94-6438-4495-a3fb-1b6f2adba0df",
		"firstname": "Felipe",
		"lastname": "Dasr",
		"email": "felipedasr@email.com",
		"createdAt": "2022-04-28T23:48:14.491Z",
		"updatedAt": "2022-04-28T23:48:14.491Z"
	},
	"tasksStats": {
		"tasks": 6,
		"completedTasks": 2,
		"lateTasks": 0,
		"percentageOfCompletedTasks": 33.333333333333336,
		"percentageOfLateTasks": 0
	}
}
```

## Delete user

| Rota        | Método       | Autenticação |
|-------------|--------------|--------------|
| **`/user`** | **`DELETE`** | **`SIM`**    |

**Exemplo de requisição**

**`DELETE`** **`/user`**

**Resposta de sucesso**

**Código**: **`200 OK`**

```json
{
	"deletedUser": {
		"id": "4f2bdf94-6438-4495-a3fb-1b6f2adba0df",
		"firstname": "Felipe",
		"lastname": "Dasr",
		"email": "felipedasr@email.com",
		"createdAt": "2022-04-28T23:48:14.491Z",
		"updatedAt": "2022-04-28T23:48:14.491Z"
	},
	"deletedTasks": 6
}
```