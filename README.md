# ForteAPI
<div align="center">
<img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/NinjaNas/ForteAPI/main">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/NinjaNas/ForteAPI">
<a href="https://github.com/NinjaNas/ForteAPI/issues"><img src="https://img.shields.io/github/issues/NinjaNas/ForteAPI" alt="issues - ForteAPI"></a>
<a href="https://typescriptlang.org" title="Go to TypeScript homepage"><img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="Made with TypeScript"></a>
<a href="https://github.com/NinjaNas/ForteAPI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue" alt="License"></a>

Forte API is a music theory API that provides a way to query set classes in 12 tone equal temperament. It uses data scraped from this <a href="https://en.wikipedia.org/wiki/List_of_set_classes">wikipedia page</a> to provide Forte numbers, prime forms, interval vectors, zygotic or twinned sets, and complements of sets.


**Currently this API is NOT live. The API is rate-limited at 100 requests per day. Make an issue if you need more requests.**

**Please make an issue for any bugs and typos you may find!**

</div>

## Table of Contents
- [What are Forte Numbers? and More!](#what-are-forte-numbers-and-more)
  - [Set Theory](#set-theory)
  - [Prime Form](#prime-form)
  - [Interval Vector](#interval-vector)
  - [Forte Numbers](#forte-numbers)
  - [Complements](#complements)
- [Should I use this API?](#should-i-use-this-api)
- [DataSet Type](#dataset-type)
- [Endpoints](#endpoints)
  - [GET /api/data](#get-apidata)
  - [GET /api/data/:prop/](#get-apidataprop)
    - [number](#number)
    - [primeForm](#primeform)
    - [vec](#vec)
    - [z](#z)
    - [complement](#complement)
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
  - [GET /api/data/complement/:query](#get-apidatacomplementquery)
    - [Exact Search](#exact-search-4)
    - [Starts With Search](#starts-with-search-2)
    - [Ends With Search](#ends-with-search-2)
- [Using this API in your app](#using-this-api-in-your-app)
  - [Client-Side Validation](#client-side-validation)
- [API Development](#api-development)
  - [Add .env File](#add-env-file)
- [Star This Repo](#star-this-repo)
## What are Forte Numbers? and More!
If you have the time watch this great playlist of videos by Jay Beard on [musical set theory](https://www.youtube.com/watch?v=3fe_NatE5w8&list=PLKWIRLQnfaw1KUMTG3b9mFrt0D3MFHvPF)!

Before getting into Forte numbers we should learn basic set theory, prime form, and interval vectors.
### Set Theory
There are 12 notes or 12 pitch classes in 12 tone equal temperament.

We can label them as so:

Set Theory Labels: **0, 1, 2, 3, 4, 5, 6, 7, 8, 9, T, E (0 to 11)**

Note Names: **C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B**

### Prime Form
Prime forms are a way to standardize sets so they can be compared. Prime form requires us to alway to have 0 first by transposition, unless it is the empty set, and have the smallest intervals as possible (compactness) going from left to right as there are different ways to order the same set
* Ex: {0,1,2,4} - Note that {1,2,3,5} is not in prime form an is a transposition of {0,1,2,4} as we can subtract 1 from all of the elements to make {0,1,2,4}

### Interval Vector
An interval vector is a six-number sequence that represents the distribution of intervals within a pitch-class set. Each number in the vector indicates the number of times a specific interval (from 1 to 6 semitones) appears between any two pitches in the set. 
* Ex: <6,4,5,6,5,2>
* Ex: <C,C,C,C,C,6> (C stands for 12 here)

### Forte Numbers
Forte numbers are a system of labeling pitch-class sets in the musical set theory, named after the musicologist Allen Forte who devised this classification system. They offer a systematic way to catalog and study the various pitch-class sets in twelve-tone music.

The labels are structured by cardinality-ordinal number. 
* Ex. 3-6 meaning the 6th set in order of sets containing 3 pitch classes/notes.

If there is A or B appended to the end it means that set has a distinct inversion, where A is given to the most compact version. Both A and B share the same interval vector
* Ex. 3-11A and 3-11B
* 3-11A has a prime form of {0,3,7} and 3-11B has a prime form of {0,3,7}
* Let's invert {0,3,7} in this system we are using mod 12 because we have 12 pitch classes
* {12-0 mod 12, 12-3 mod 12, 12-7 mod 12} = {0, 9, 5}
* Order for compactness: {5, 9, 0} has the smallest intervals going from left to right
* Transpose so first element is 0: {5-5, 9-5, 12(0)-5) = {0,4,7}

If there is a Z in the Forte number this means it is a zygotic/twinned set that has a twin set with the same interval vector and is not an inversion of the set. In this API, the Z property is linked only A when applicable for consistency.
* Ex: 4-z15A and 4-z29A
* Ex: 6-z4 and 6-z37

### Complements
Complements are pairs of sets that add up to set with all pitch classes {0,1,2,3,4,5,6,7,8,9,T,E}. If a set does not have a complement that means they are a complement of themselves
* Ex: Prime form of {} is a complement of {0,1,2,3,4,5,6,7,8,9,T,E}
* Ex: {0,1,3,4} is a complement of {0,1,2,3,4,5,6,9} after some transposition

## Should I use this API?
You should only use this API either if you care about your intital load times as the full data size is ~34KB or if you want a prebuilt solution to query set classes.

If you do not need to use this API, you should just download the json [here](https://github.com/NinjaNas/ForteAPI/blob/main/data/set_classes.json). Report any typos you may find or suggest new properties.
## DataSet Type
```ts
type DataSet = {
	number: string;
	primeForm: string;
	vec: string;
	z: null | string;
	complement: null | string;
};
```
## Endpoints
### GET /api/data
The endpoint returns all of the data from [/data/set-classes.json](https://github.com/NinjaNas/ForteAPI/blob/main/data/set_classes.json)
```ts
[
	{
		"number": "0-1",
		"primeForm": "[]",
		"vec": "<0,0,0,0,0,0>",
		"z": null,
                "complement": "12-1"
	},
         ...
	{
		"number": "12-1",
		"primeForm": "[0,1,2,3,4,5,6,7,8,9,T,E]",
		"vec": "<C,C,C,C,C,6>",
		"z": null,
                "complement": "0-1"
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
#### complement
```ts
// GET /api/data/complement
[
  "12-1",
   ...
  "0-1"
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
    "z": null,
    "complement": "11-1"
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
    "z": "4-z29A",
    "complement": "8-z15B"
  },
  {
    "number": "4-z15B",
    "primeForm": "[0,2,5,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15A"
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
    "z": "6-z29",
    "complement": "6-z29"
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
    "z": null,
    "complement": "11-1"
  },
  {
    "number": "2-1",
    "primeForm": "[0,1]",
    "vec": "<1,0,0,0,0,0>",
    "z": null,
    "complement": "10-1"
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
    "z": null,
    "complement": "11-1"
  },
  {
    "number": "4-z15A",
    "primeForm": "[0,1,4,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15B"
  },
  {
    "number": "4-z15B",
    "primeForm": "[0,2,5,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15A"
  },
  {
    "number": "6-z50",
    "primeForm": "[0,1,4,6,7,9]",
    "vec": "<2,2,4,2,3,2>",
    "z": "6-z29",
    "complement": "6-z29"
  },
  {
    "number": "2-1",
    "primeForm": "[0,1]",
    "vec": "<1,0,0,0,0,0>",
    "z": null,
    "complement": "10-1"
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
    "z": null,
    "complement": "0-1"
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
    "z": null,
    "complement": "1-1"
  },
  {
    "number": "12-1",
    "primeForm": "[0,1,2,3,4,5,6,7,8,9,T,E]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1"
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
    "z": "4-z29A",
    "complement": "8-z15B"
  },
  {
    "number": "4-z15B",
    "primeForm": "[0,2,5,6]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15A"
  },
  {
    "number": "4-z29A",
    "primeForm": "[0,1,3,7]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A",
    "complement": "8-z29B"
  },
  {
    "number": "4-z29B",
    "primeForm": "[0,4,6,7]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A",
    "complement": "8-z29A"
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
    "z": null,
    "complement": "8-12A"
  },
  {
    "number": "4-12B",
    "primeForm": "[0,3,4,6]",
    "vec": "<1,1,2,1,0,1>",
    "z": null,
    "complement": "8-12B"
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
    "complement": "12-1"
  },
   ...
  {
    "number": "12-1",
    "primeForm": "[0,1,2,3,4,5,6,7,8,9,T,E]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1"
  }
]

// GET /api/data/z/5-z37
[
  {
    "number": "5-z17",
    "primeForm": "[0,1,3,4,8]",
    "vec": "<2,1,2,3,2,0>",
    "z": "5-z37",
    "complement": "7-z17"
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
    "z": "4-z15A",
    "complement": "8-z29B"
  },
  {
    "number": "4-z29B",
    "primeForm": "[0,4,6,7]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A",
    "complement": "8-z29A"
  }
]
```
#### Ends With Search
```ts
// GET /api/data/z/-z50$
[
  {
    "number": "6-z29",
    "primeForm": "[0,2,3,6,7,9]",
    "vec": "<2,2,4,2,3,2>",
    "z": "6-z50",
    "complement": "6-z50"
  }
]
```
### GET /api/data/complement/:query
The endpoint returns an array of objects based on the query on the complement property
* Max URI length: No more than 8 characters
#### Exact Search
```ts
// GET /api/data/complement/null
[
  {
    "number": "6-1",
    "primeForm": "[0,1,2,3,4,5]",
    "vec": "<5,4,3,2,1,0>",
    "z": null,
    "complement": null
  },
   ...
  {
    "number": "6-35",
    "primeForm": "[0,2,4,6,8,T]",
    "vec": "<0,6,0,6,0,3>",
    "z": null,
    "complement": null
  }
]

// GET /api/data/complement/5-z37
[
  {
    "number": "7-z37",
    "primeForm": "[0,1,3,4,5,7,8]",
    "vec": "<4,3,4,5,4,1>",
    "z": "7-z17",
    "complement": "5-z37"
  }
]
```
#### Starts With Search
```ts
// GET /api/data/complement/^4-z15
[
  {
    "number": "8-z15A",
    "primeForm": "[0,1,2,3,4,6,8,9]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15B"
  },
  {
    "number": "8-z15B",
    "primeForm": "[0,1,3,5,6,7,8,9]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15A"
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
    "z": "6-z50",
    "complement": "6-z50"
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

// Max Length Example: ^4-z15A$
isNumberValidLength = input.length > 8
complementRegex = ^(null|\^?[1-9]?[0-9]-z?[1-9]?[0-9][AB]?\$?|\^[1-9]?[0-9]|\^[1-9]?[0-9]-|\^[1-9]?[0-9]-z?|\^[1-9]?[0-9]-z?[1-9]?[0-9]|[AB]\$|[1-9]?[0-9][AB]?\$|z?[1-9]?[0-9][AB]?\$|-z?[1-9]?[0-9][AB]?\$)$
```
## API Development
### Add .env File
```env
NODE_ENV=development
PORT=[choose any port]
```
## Star This Repo
If you like this API please give it a star! *\~ Created by Khang Tran*
