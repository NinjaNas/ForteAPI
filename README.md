# ForteAPI
<p align="center">
<img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/NinjaNas/ForteAPI/main">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/NinjaNas/ForteAPI">
<a href="https://github.com/NinjaNas/ForteAPI/issues"><img src="https://img.shields.io/github/issues/NinjaNas/ForteAPI" alt="issues - ForteAPI"></a>
<a href="https://typescriptlang.org" title="Go to TypeScript homepage"><img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="Made with TypeScript"></a>
<a href="https://github.com/NinjaNas/ForteAPI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue" alt="License"></a>
<p align="center">
Forte API is a music theory API that provides a way to query set classes in 12 tone equal temperament. It uses data found on this <a href="https://en.wikipedia.org/wiki/List_of_set_classes">wikipedia page</a> to provide Forte numbers, prime forms, interval vectors, zygotic or twinned sets, and complements of sets.
</p>
</p>

## Table of Contents
- [What are Forte Numbers? and More!](#what-are-forte-numbers-and-more)
- [Should I use this API?](#should-i-use-this-api)
- [Endpoints](#endpoints)
  - [GET /api/data](#get-apidata)
  - [GET /api/data/:prop/](#get-apidataprop)
    - [number](#number)
    - [primeForm](#primeform)
    - [vec](#vec)
    - [z](#z)
  - [GET /api/data/number/:query](#get-apidatanumberquery)
    - [Exact Search](#exact-search)
    - [Starts With Search](#starts-with-search)
    - [Ends With Search](#ends-with-search)
    - [Range Search](#range-search-inclusive)
    - [Chaining Methods](#chaining-methods-no-duplicates)
  - [GET /api/data/primeForm/:query](#get-apidataprimeformquery)
    - [Exact Search](#exact-search-1)
    - [Fuzzy Search / Superset Search](#fuzzy-search--superset-search)
  - [GET /api/data/vec/:query](#get-apidatavecquery)
    - [Exact Search](#exact-search-2)
    - [Wildcard Search](#wildcard-search)
  - [GET /api/data/z/:query](#get-apidatazquery)
    - [Exact Search](#exact-search-3)
    - [Starts With Search](#starts-with-search-1)
    - [Ends With Search](#ends-with-search-1)
- [Using this API in your app](#using-this-api-in-your-app)
  - [Client-Side Validation](#client-side-validation)
- [API Development](#api-development)
  - [Add .env File](#add-env-file)
- [Star This Repo](#star-this-repo)
## What are Forte Numbers? and More!
## Should I use this API?
You should only use this API either if you care about your intital load times as the full data size is ~27KB or if you want a prebuilt solution to query set classes.

If you do not need to use this API, you should just download the json [here](https://github.com/NinjaNas/ForteAPI/blob/main/data/set_classes.json)
## Endpoints
### GET /api/data
The endpoint returns all of the data from [/data/set-classes.json](https://github.com/NinjaNas/ForteAPI/blob/main/data/set_classes.json)
```ts
[
	{
		"number": "0-1",
		"primeForm": "[]",
		"vec": "<0,0,0,0,0,0>",
		"z": null
	},
         ...
	{
		"number": "12-1",
		"primeForm": "[0,1,2,3,4,5,6,7,8,9,T,E]",
		"vec": "<C,C,C,C,C,6>",
		"z": null
	}
]
```
### GET /api/data/:prop/
The endpoint returns a flatmap of the valid properties (number, primeForm, vec, z)
#### number
```ts
// GET /api/data/number
[
  "0-1",
   ...
  "4-z15A",
   ...
  "12-1"
]
```
#### primeForm
```ts
// GET /api/data/primeForm
[
  "[]",
   ...
  "[0,1,2,3,4,5,6,7,8,9,T,E]"
]
```
#### vec
```ts
// GET /api/data/vec
[
  "<0,0,0,0,0,0>",
   ...
  "<C,C,C,C,C,6>"
]
```
#### z
```ts
// GET /api/data/z
[
  null,
   ...
  "4-z15A",
   ...
  null
]
```
### GET /api/data/number/:query
The endpoint returns an array of objects based on the query on the number property
* Max URI length: No more than 100 characters
#### Exact Search
```ts
// GET /api/data/number/1-1 or GET /api/data/number/^1-1$
[
  {
    "number": "1-1",
    "primeForm": "[0]",
    "vec": "<0,0,0,0,0,0>",
    "z": null
  }
]
```
#### Starts With Search
```ts
// GET /api/data/number/^4-z15
[
  {
    "number": "4-z15A",
    "primeForm": "[0,1,4,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A"
  },
  {
    "number": "4-z15B",
    "primeForm": "[0,2,5,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A"
  }
]
```
#### Ends With Search
```ts
// GET /api/data/number/-z50$
[
  {
    "number": "6-z50",
    "primeForm": "[0,1,4,6,7,9]",
    "vec": "<2,2,4,2,3,2>",
    "z": "6-z29"
  }
]
```
#### Range Search (inclusive)
```ts
// GET /api/data/number/1-1~2-1
// WARNING: 1-1~1-1 is invalid and will send a 400 status code, use 1-1 instead
[
  {
    "number": "1-1",
    "primeForm": "[0]",
    "vec": "<0,0,0,0,0,0>",
    "z": null
  },
  {
    "number": "2-1",
    "primeForm": "[0,1]",
    "vec": "<1,0,0,0,0,0>",
    "z": null
  }
]
```
#### Chaining Methods (no duplicates)
```ts
// chaining methods (no duplicates):
// GET /api/data/number/1-1,^1-1$,^4-z15,-z50$,1-1~2-1
[
  {
    "number": "1-1",
    "primeForm": "[0]",
    "vec": "<0,0,0,0,0,0>",
    "z": null
  },
  {
    "number": "4-z15A",
    "primeForm": "[0,1,4,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A"
  },
  {
    "number": "4-z15B",
    "primeForm": "[0,2,5,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A"
  },
  {
    "number": "6-z50",
    "primeForm": "[0,1,4,6,7,9]",
    "vec": "<2,2,4,2,3,2>",
    "z": "6-z29"
  },
  {
    "number": "2-1",
    "primeForm": "[0,1]",
    "vec": "<1,0,0,0,0,0>",
    "z": null
  }
]
```
### GET /api/data/primeForm/:query
The endpoint returns an array of objects based on the query on the primeForm property
* Max URI length: No more than 25 characters
#### Exact Search
```ts
// GET /api/data/primeForm/[0,1,2,3,4,5,6,7,8,9,T,E]
[
  {
    "number": "12-1",
    "primeForm": "[0,1,2,3,4,5,6,7,8,9,T,E]",
    "vec": "<C,C,C,C,C,6>",
    "z": null
  }
]
```
#### Fuzzy Search / Superset Search
```ts
// GET /api/data/primeForm/0123456789T or GET /api/data/primeForm/1023456789TT
// input is allowed in any order and with duplicates
[
  {
    "number": "11-1",
    "primeForm": "[0,1,2,3,4,5,6,7,8,9,T]",
    "vec": "<T,T,T,T,T,5>",
    "z": null
  },
  {
    "number": "12-1",
    "primeForm": "[0,1,2,3,4,5,6,7,8,9,T,E]",
    "vec": "<C,C,C,C,C,6>",
    "z": null
  }
]
```
### GET /api/data/vec/:query
The endpoint returns an array of objects based on the query on the vec property
* Max URI length: No more than 13 characters
#### Exact Search
```ts
// GET /api/data/vec/<1,1,1,1,1,1>
[
  {
    "number": "4-z15A",
    "primeForm": "[0,1,4,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A"
  },
  {
    "number": "4-z15B",
    "primeForm": "[0,2,5,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A"
  },
  {
    "number": "4-z29A",
    "primeForm": "[0,1,3,7]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A"
  },
  {
    "number": "4-z29B",
    "primeForm": "[0,4,6,7]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A"
  }
]
```
#### Wildcard Search
```ts
// GET /api/data/vec/1121X1
// capital X must be used as the wildcard
[
  {
    "number": "4-12A",
    "primeForm": "[0,2,3,6]",
    "vec": "<1,1,2,1,0,1>",
    "z": null
  },
  {
    "number": "4-12B",
    "primeForm": "[0,3,4,6]",
    "vec": "<1,1,2,1,0,1>",
    "z": null
  }
]
```
### GET /api/data/z/:query
The endpoint returns an array of objects based on the query on the z property
* Max URI length: No more than 8 characters
#### Exact Search
```ts
// GET /api/data/z/null
[
  {
    "number": "0-1",
    "primeForm": "[]",
    "vec": "<0,0,0,0,0,0>",
    "z": null
  },
   ...
  {
    "number": "12-1",
    "primeForm": "[0,1,2,3,4,5,6,7,8,9,T,E]",
    "vec": "<C,C,C,C,C,6>",
    "z": null
  }
]

// GET /api/data/z/5-z37
[
  {
    "number": "5-z17",
    "primeForm": "[0,1,3,4,8]",
    "vec": "<2,1,2,3,2,0>",
    "z": "5-z37"
  }
]
```
#### Starts With Search
```ts
// GET /api/data/z/^4-z15
[
  {
    "number": "4-z29A",
    "primeForm": "[0,1,3,7]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A"
  },
  {
    "number": "4-z29B",
    "primeForm": "[0,4,6,7]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A"
  }
]
```
#### Ends With Search
```ts
// GET /api/data/number/-z50$
[
  {
    "number": "6-z29",
    "primeForm": "[0,2,3,6,7,9]",
    "vec": "<2,2,4,2,3,2>",
    "z": "6-z50"
  }
]
```
## Using this API in your app
### Client-Side Validation
This is a basic example of how you can implement client-side validation with a max length and regex for the query endpoint. 
* Please note, that queries can be formatted correctly but not found thus giving a 400 status code. The main idea of using regex is to prevent the user from hitting the API when their input is invalid.

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
## Star This Repo
If you like this API please give it a star!
