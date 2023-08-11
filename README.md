# ForteAPI
Intro
## Table of Contents
- [What are Forte Numbers? and More!](#what-are-forte-numbers-and-more)
- [Should I use this API?](#should-i-use-this-api)
- [Endpoints](#endpoints)
  - [/api/data](#apidata)
  - [/api/data/:prop/](#apidataprop)
  - [/api/data/number/:query](#apidatanumberquery)
  - [/api/data/primeForm/:query](#apidataprimeformquery)
  - [/api/data/vec/:query](#apidatavecquery)
  - [/api/data/z/:query](#apidatazquery)
- [Using this API in your app](#using-this-api-in-your-app)
  - [Client-Side Validation](#client-side-validation)
- [API Development](#api-development)
  - [Add .env File](#add-env-file)
## What are Forte Numbers? and More!
## Should I use this API?
## Endpoints
### /api/data
### /api/data/:prop/
### /api/data/number/:query
### /api/data/primeForm/:query
### /api/data/vec/:query
### /api/data/z/:query
## Using this API in your app
### Client-Side Validation
This is a basic example of how you can implement client-side validation with a max length and regex for the query endpoint. 
* Please note, that queries can be valid but not found thus giving a 400 status code. The main idea of using regex is to prevent the user from hitting the API when their input is invalid.

You can ignore the regex if you do not care if the user might hit the API more often due to invalid input. 
```ts
// Max Length Example: 0-1,1-1,2-1,2-2,2-3,2-4,2-5,2-6,3-2A,3-2B,3-3A,3-3B,3-4A,3-4B,3-5A,3-5B,3-6,3-7A,3-7B,3-8A,3-8B,4-2A
isNumberValidLength = input.length > 100
numberRegex = /^((\^?[1-9]?[0-9]-z?[1-9]?[0-9][AB]?\$?|\^[1-9]?[0-9]|\^[1-9]?[0-9]-|\^[1-9]?[0-9]-z?|\^[1-9]?[0-9]-z?[1-9]?[0-9]|[AB]\$|[1-9]?[0-9][AB]?\$|z?[1-9]?[0-9][AB]?\$|-z?[1-9]?[0-9][AB]?\$)|([1-9]?[0-9]-z?[1-9]?[0-9][AB]?~[1-9]?[0-9]-z?[1-9]?[0-9][AB]?)(,(\^?[1-9]?[0-9]-z?[1-9]?[0-9][AB]?\$?|\^[1-9]?[0-9]|\^[1-9]?[0-9]-|\^[1-9]?[0-9]-z?|\^[1-9]?[0-9]-z?[1-9]?[0-9]|[AB]\$|[1-9]?[0-9][AB]?\$|z?[1-9]?[0-9][AB]?\$|-z?[1-9]?[0-9][AB]?\$)|([1-9]?[0-9]-z?[1-9]?[0-9][AB]?~[1-9]?[0-9]-z?[1-9]?[0-9][AB]?))\*)$^((\^?[1-9]?[0-9]-z?[1-9]?[0-9][AB]?\$?)|([1-9]?[0-9]-z?[1-9]?[0-9][AB]?~[1-9]?[0-9]-z?[1-9]?[0-9][AB]?))((,\^?[1-9]?[0-9]-z?[1-9]?[0-9][AB]?\$?)|(,[1-9]?[0-9]-z?[1-9]?[0-9][AB]?~[1-9]?[0-9]-z?[1-9]?[0-9][AB]?))\*$/

// Max Length Example: [0,1,2,3,4,5,6,7,8,9,T,E] 
isNumberValidLength = input.length > 25
primeFormRegex = /^(\[(0)?(,1)?(,2)?(,3)?(,4)?(,5)?(,6)?(,7)?(,8)?(,9)?(,T)?(,E)?]|(?!._(.)._\14)[0-9TE]{1,12})$/

// Max Length Example: <1,1,1,1,1,1>
isNumberValidLength = input.length > 13
vecRegex = /^<[0-9TEC],[0-9TEC],[0-9TEC],[0-9TEC],[0-9TEC],[0-9TEC]>|[0-9TECX]{6,6}$/

// Max Length Example: ^4-z15A$
isNumberValidLength = input.length > 8
zRegex = /^(null|\^?[1-9]?[0-9]-z[1-9]?[0-9][AB]?\$?|\^[1-9]?[0-9]|\^[1-9]?[0-9]-|\^[1-9]?[0-9]-z|\^[1-9]?[0-9]-z[1-9]?[0-9]|[AB]\$|[1-9]?[0-9][AB]?\$|z[1-9]?[0-9][AB]?\$|-z[1-9]?[0-9][AB]?\$)$/
```
## API Development
### Add .env File
```env
NODE_ENV=development
PORT=[choose any port]
```
