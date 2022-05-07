# Todo back-end

<div align="center"></br>
  <img alt="Typescript badge" src="https://img.shields.io/badge/Typescript-00B1EA?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="NodeJS badge" src="https://img.shields.io/badge/Node.js-90C53F?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="API badge" src="https://img.shields.io/badge/API%20REST-E64D80?style=for-the-badge" />
  <img alt="ExpressJS badge" src="https://img.shields.io/badge/Express.js-333331?style=for-the-badge" />
  <img alt="TypeORM badge" src="https://img.shields.io/badge/TYPEORM-FFAB00?style=for-the-badge" />
</div></br>

Aplicação feita em typescript, com o objetivo de demonstrar minhas habilidades com TS. Essa API REST é capaz de armazenar tarefas de cada usuário individualmente, fazendo possível agendar e visualizar objetivos diariamente, semanalmente e mensalmente. A aplicação é um CRUD em si, capaz de criar, consultar, alterar e deletar dados. Feita utilizando boas práticas e tecnologias muito usadas hoje em dia.

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
| **`email`**       | **`string`** | body | E-mail do usuário para a recuperação da conta |
| **`code`**        | **`string`** | body | Código recebido no e-mail                     |
| **`newPassword`** | **`string`** | body | Nova senha                                    |

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