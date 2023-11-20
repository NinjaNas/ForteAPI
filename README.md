# ForteAPI
<div align="center">
<h3></h3>
<img width="100" height="100" src="https://img.icons8.com/ios-filled/100/curly-brackets.png" alt="curly-brackets"/>
<h3></h3>
</div>

<div align="center">
<img alt="GitHub last commit (branch)" src="https://img.shields.io/github/last-commit/NinjaNas/ForteAPI/main">
<a href="https://github.com/NinjaNas/ForteAPI/issues"><img src="https://img.shields.io/github/issues/NinjaNas/ForteAPI" alt="issues - ForteAPI"></a>
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/NinjaNas/ForteAPI">
<a href="https://typescriptlang.org" title="Go to TypeScript homepage"><img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="Made with TypeScript"></a>
<a href="https://github.com/NinjaNas/ForteAPI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue" alt="License"></a>

Forte API is a music theory API that provides a way to query set classes in 12 tone equal temperament. It uses data scraped from this <a href="https://en.wikipedia.org/wiki/List_of_set_classes">wikipedia page</a> to provide Forte numbers, prime forms, interval vectors, zygotic or twinned sets, and complements of sets.

##

**Currently this API is live [here](https://hcda8f8dtk.execute-api.us-east-1.amazonaws.com/prod/api/data/) using AWS API Gateway + AWS Lambda!**
**Check out the OpenAPI docs on SwaggerHub [here](https://app.swaggerhub.com/apis-docs/NinjaNas/ForteAPI/1.3.1)!**

**The API is rate-limited at 500 requests per day. Make an issue if you need more requests.**

**Please make an issue for any bugs and typos you may find!**

</div>

## Table of Contents

- [App Example](#app-example)
- [What are Forte Numbers? and More!](#what-are-forte-numbers-and-more)
  - [Set Theory](#set-theory)
  - [Prime Form](#prime-form)
  - [Interval Vector](#interval-vector)
  - [Forte Numbers](#forte-numbers)
  - [Complements](#complements)
- [Should I use this API?](#should-i-use-this-api)
- [DataSet Type](#dataset-type)
- [Status Codes](#status-codes)
- [Endpoints](#endpoints)
  - [GET /api/data/](#get-apidata)
  - [GET /api/data/:queryProp/](#get-apidataqueryprop)
  - [GET /api/flatdata/:queryprop/](#get-apiflatdataqueryprop)
    - [number](#number)
    - [primeForm](#primeform)
    - [vec](#vec)
    - [z](#z)
    - [complement](#complement)
    - [inversion](#inversion)
  - [GET /api/hashdata/:queryPropKey/:queryPropValue/](#get-apihashdataquerypropkeyquerypropvalue)
  - [GET /api/data/number/:querySearch/](#get-apidatanumberquerysearch)
    - [Exact Search](#exact-search)
    - [Starts With Search](#starts-with-search)
    - [Ends With Search](#ends-with-search)
    - [Contains Search](#contains-search)
    - [Substring Search](#substring-search)
    - [Not Search](#not-search)
    - [Exclude Search](#exclude-search)
    - [Chaining Methods](#chaining-methods-no-duplicates)
  - [GET /api/data/primeForm/:querySearch/](#get-apidataprimeformquerysearch)
    - [Exact Search](#exact-search-1)
    - [Starts With Search](#starts-with-search-1)
    - [Ends With Search](#ends-with-search-1)
    - [Contains Search](#contains-search-1)
    - [Substring Search](#substring-search-1)
    - [Not Search](#not-search-1)
    - [Exclude Search](#exclude-search-1)
    - [Chaining Methods](#chaining-methods-no-duplicates-1)
  - [GET /api/data/vec/:querySearch/](#get-apidatavecquerysearch)
    - [Exact Search](#exact-search-2)
    - [Starts With Search](#starts-with-search-2)
    - [Ends With Search](#ends-with-search-2)
    - [Contains Search](#contains-search-2)
    - [Substring Search](#substring-search-2)
    - [Not Search](#not-search-2)
    - [Exclude Search](#exclude-search-2)
    - [Chaining Methods](#chaining-methods-no-duplicates-2)
  - [GET /api/data/vec/:querySearch/:queryInequality](#get-apidatavecquerysearchqueryinequality)
    - [Equal Search](#equal-search)
    - [Less Than Search](#less-than-search)
    - [Less Than Or Equal To Search](#less-than-or-equal-to-search)
    - [Greater Than Search](#greater-than-search)
    - [Greater Than Or Equal To Search](#greater-than-or-equal-to-search)
  - [GET /api/data/z/:querySearch/](#get-apidatazquerysearch)
    - [Exact Search](#exact-search-3)
    - [Starts With Search](#starts-with-search-3)
    - [Ends With Search](#ends-with-search-3)
    - [Contains Search](#contains-search-3)
    - [Substring Search](#substring-search-3)
    - [Not Search](#not-search-3)
    - [Exclude Search](#exclude-search-3)
    - [Chaining Methods](#chaining-methods-no-duplicates-3)
  - [GET /api/data/complement/:querySearch/](#get-apidatacomplementquerysearch)
    - [Exact Search](#exact-search-4)
    - [Starts With Search](#starts-with-search-4)
    - [Ends With Search](#ends-with-search-4)
    - [Contains Search](#contains-search-4)
    - [Substring Search](#substring-search-4)
    - [Not Search](#not-search-4)
    - [Exclude Search](#exclude-search-4)
    - [Chaining Methods](#chaining-methods-no-duplicates-4)
  - [GET /api/data/inversion/:querySearch/](#get-apidatainversionquerysearch)
    - [Exact Search](#exact-search-5)
    - [Starts With Search](#starts-with-search-5)
    - [Ends With Search](#ends-with-search-5)
    - [Contains Search](#contains-search-5)
    - [Substring Search](#substring-search-5)
    - [Not Search](#not-search-5)
    - [Exclude Search](#exclude-search-5)
    - [Chaining Methods](#chaining-methods-no-duplicates-5)
  - [GET /api/data/:queryProp/PROPERTY/querySearch](#get-apidataqueryproppropertyquerysearch)
    - [Endpoints](#endpoints-1) 
  - [GET /api/data/d3/:querySearch/](#get-apidatad3querysearch)
    - [Types](#types)
    - [Cardinality-Increasing vs Strict-Increasing](#cardinality-increasing-vs-strict-increasing)
    - [Vector-Similarity](#vector-similarity)
    - [Original vs Inversion](#original-vs-inversion)
    - [Manual Construction](#manual-construction)
        - [Fetch](#fetch)
    	- [Links](#links)
     	- [Dag](#dag)
    - [How to Use JSON in D3Dag](#how-to-use-json-in-d3dag)
    - [Endpoints](#endpoints)
- [API Development](#api-development)
  - [Add .env File](#add-env-file)
- [Star This Repo](#star-this-repo)

## App Example

Check out my app [set-class-visualizer](https://github.com/NinjaNas/set-class-visualizer) using ForteAPI to serve its data and dags!

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

- Ex: {0,1,2,4} - Note that {1,2,3,5} is not in prime form an is a transposition of {0,1,2,4} as we can subtract 1 from all of the elements to make {0,1,2,4}

### Interval Vector

An interval vector is a six-number sequence that represents the distribution of intervals within a pitch-class set. Each number in the vector indicates the number of times a specific interval (from 1 to 6 semitones) appears between any two pitches in the set.

- Ex: <6,4,5,6,5,2>
- Ex: <C,C,C,C,C,6> (C stands for 12 here)

### Forte Numbers

Forte numbers are a system of labeling pitch-class sets in the musical set theory, named after the musicologist Allen Forte who devised this classification system. They offer a systematic way to catalog and study the various pitch-class sets in twelve-tone music.

The labels are structured by cardinality-ordinal number.

- Ex. 3-6 meaning the 6th set in order of sets containing 3 pitch classes/notes.
- In general the smaller the ordinal number the more compact the set is.

Allen Forte did not differentiate between inversions in his book so 3-11A and 3-11B would just be 3-11 using 3-11A as its most compact form. Later on, notation was made to differentiate between inversions. If there is A or B appended to the end it means that set has a distinct inversion, where A is given to the most compact version. Both A and B sets share the same interval vector.

- Ex. 3-11A and 3-11B
- 3-11A has a prime form of {0,3,7} and 3-11B has a prime form of {0,3,7}
- Let's invert {0,3,7} in this system we are using mod 12 because we have 12 pitch classes
- {12-0 mod 12, 12-3 mod 12, 12-7 mod 12} = {0, 9, 5}
- Order for compactness: {5, 9, 0} has the smallest intervals going from left to right
- Transpose so first element is 0: {5-5, 9-5, 12(0)-5) = {0,4,7}

If there is a Z in the Forte number this means it is a zygotic/twinned set that has a twin set with the same interval vector and is not an inversion of the set. In this API, the Z property is linked only A when applicable for consistency.

- Ex: 4-z15A and 4-z29A
- Ex: 6-z4 and 6-z37

### Complements

Complements are pairs of sets that add up to set with all pitch classes {0,1,2,3,4,5,6,7,8,9,T,E}. If a set does not have a complement that means they are a complement of themselves

- Ex: Prime form of {} is a complement of {0,1,2,3,4,5,6,7,8,9,T,E}
- Ex: {0,1,3,4} is a complement of {0,1,2,3,4,5,6,9} after some transposition

## Should I use this API?

You should only use this API either if you care about your intital load times as the full data size is ~42KB or if you want a prebuilt solution to query set classes. You can use this API to get and serve prebuilt d3dag graphs for visualization or the just the links for you to create your own custom graphs. 

If you do not need to use this API, you should just download the json [here](https://github.com/NinjaNas/ForteAPI/blob/main/data/set_classes.json). Report any typos you may find or suggest new properties.

There are also d3dag graphs and links avaliable in JSON [here](https://github.com/NinjaNas/ForteAPI/blob/main/data/d3).

## DataSet Type

**Note: Properties are case-sensitive!**

```ts
type DataSet = {
	number: string;
	primeForm: string; // can be easily formatted to a string[] by JSON.parse(primeFormString)
	vec: string;
	z: null | string;
	complement: null | string;
	inversion: null | string;
}[];
```

## Status Codes

500 - Internal Server Error
414 - URI or Subquery Too Long
400 - Bad Property / Request Returned Nothing
200 - Success

## Endpoints

### GET /api/data/

The endpoint returns all of the data from [/data/set-classes.json](https://github.com/NinjaNas/ForteAPI/blob/main/data/set_classes.json)

```ts
[
  {
    "number": "0-1",
    "primeForm": "[\"\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "12-1",
    "inversion": null
  },
    ...
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

### GET /api/data/:queryProp/

The endpoint returns the full data given the properties provided in a comma separated list (number, primeForm, vec, z, complement, inversion)

- Max URI length: No more than 43 characters
- Subquery length: 1-10 characters

```ts
// GET /api/data/number
[
  {
    "number": "0-1"
  },
    ...
  {
    "number": "12-1"
  },
];

// GET /api/data/number,primeForm
[
  {
    "number": "0-1"
    "primeForm": "[\"\"]",
  },
    ...
  {
    "number": "12-1"
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]"
  },
];
```

### GET /api/flatdata/:queryProp/

The endpoint returns a flatmap of the valid properties (number, primeForm, vec, z, complement, inversion)

- Max URI length: No more than 10 characters

#### number

```ts
// GET /api/flatdata/number
["0-1", ..., "4-z15A", ..., "12-1"];
```

#### primeForm

```ts
// GET /api/flatdata/primeForm
["[\"\"]", ..., "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]"];
```

#### vec

```ts
// GET /api/flatdata/vec
["<0,0,0,0,0,0>", ..., "<C,C,C,C,C,6>"];
```

#### z

```ts
// GET /api/flatdata/z
[null, ..., "4-z15A", ..., null];
```

#### complement

```ts
// GET /api/flatdata/complement
["12-1", ..., "0-1"];
```
#### inversion

```ts
// GET /api/flatdata/inversion
["null", ..., "[\"0\",\"2\",\"5\",\"6\"]", ..., "null"];
```


### GET /api/hashdata/:queryPropKey/:queryPropValue/

The endpoint returns a hashmap with two the valid properties (number, primeForm, vec, z, complement, inversion)

- Max URI length For Both Queries: No more than 10 characters

```ts
// GET /api/hashdata/number/primeForm
{
  "0-1": "[\"\"]",
    ...
  "12-1": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]"
};
```


### GET /api/data/number/:querySearch/

The endpoint returns an array of objects based on the query on the number property

- Max URI length: No more than 100 characters
- Subquery length: 2-15 characters
	- Ex. ^1 or !`6-z25A~6-z25B

#### Exact Search

```ts
// GET /api/data/number/1-1
[
  {
    "number": "1-1",
    "primeForm": "[\"0\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "11-1",
    "inversion": null
  }
];
```

#### Starts With Search

```ts
// GET /api/data/number/^4-z15
[
  {
    "number": "4-z15A",
    "primeForm": "[\"0\",\"1\",\"4\",\"6\"]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15B",
    "inversion": "[\"0\",\"2\",\"5\",\"6\"]"
  },
  {
    "number": "4-z15B",
    "primeForm": "[\"0\",\"2\",\"5\",\"6\"]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15A",
    "inversion": "[\"0\",\"1\",\"4\",\"6\"]"
  }
];
```

#### Ends With Search

```ts
// GET /api/data/number/-z50$
[
  {
    "number": "6-z50",
    "primeForm": "[\"0\",\"1\",\"4\",\"6\",\"7\",\"9\"]",
    "vec": "<2,2,4,2,3,2>",
    "z": "6-z29",
    "complement": "6-z29",
    "inversion": null
  }
];
```

#### Contains Search

```ts
// GET /api/data/number/@12A or GET /api/data/number/@21A
[
  {
    "number": "4-12A",
    "primeForm": "[\"0\",\"2\",\"3\",\"6\"]",
    "vec": "<1,1,2,1,0,1>",
    "z": null,
    "complement": "8-12A",
    "inversion": "[\"0\",\"3\",\"4\",\"6\"]"
  },
  {
    "number": "5-21A",
    "primeForm": "[\"0\",\"1\",\"4\",\"5\",\"8\"]",
    "vec": "<2,0,2,4,2,0>",
    "z": null,
    "complement": "7-21B",
    "inversion": "[\"0\",\"3\",\"4\",\"7\",\"8\"]"
  },
  {
    "number": "6-z12A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"6\",\"7\"]",
    "vec": "<3,3,2,2,3,2>",
    "z": "6-z41A",
    "complement": "6-z41B",
    "inversion": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\"]"
  },
  {
    "number": "6-21A",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"8\"]",
    "vec": "<2,4,2,4,1,2>",
    "z": null,
    "complement": null,
    "inversion": "[\"0\",\"2\",\"4\",\"5\",\"6\",\"8\"]"
  },
  {
    "number": "7-21A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"8\",\"9\"]",
    "vec": "<4,2,4,6,4,1>",
    "z": null,
    "complement": "5-21B",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"8\",\"9\"]"
  },
  {
    "number": "8-12A",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"6\",\"7\",\"9\"]",
    "vec": "<5,5,6,5,4,3>",
    "z": null,
    "complement": "4-12A",
    "inversion": "[\"0\",\"2\",\"3\",\"4\",\"5\",\"6\",\"8\",\"9\"]"
  }
];
```

#### Substring Search

```ts
// GET /api/data/number/*12A
[
  {
    "number": "4-12A",
    "primeForm": "[\"0\",\"2\",\"3\",\"6\"]",
    "vec": "<1,1,2,1,0,1>",
    "z": null,
    "complement": "8-12A",
    "inversion": "[\"0\",\"3\",\"4\",\"6\"]"
  },
  {
    "number": "6-z12A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"6\",\"7\"]",
    "vec": "<3,3,2,2,3,2>",
    "z": "6-z41A",
    "complement": "6-z41B",
    "inversion": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\"]"
  },
  {
    "number": "8-12A",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"6\",\"7\",\"9\"]",
    "vec": "<5,5,6,5,4,3>",
    "z": null,
    "complement": "4-12A",
    "inversion": "[\"0\",\"2\",\"3\",\"4\",\"5\",\"6\",\"8\",\"9\"]"
  }
];
```

#### Range Search (inclusive)

The only filtering methods that you can use with range search are \` and ! (which is also !\`).
  - Ex: \`1-1\~2-1, !1-1\~2-1, !\`1-1\~2-1

```ts
// GET /api/data/number/1-1~2-1
// WARNING: 1-1~1-1 is invalid and will send a 400 status code, use 1-1 instead
[
  {
    "number": "1-1",
    "primeForm": "[\"0\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "11-1",
    "inversion": null
  },
  {
    "number": "2-1",
    "primeForm": "[\"0\",\"1\"]",
    "vec": "<1,0,0,0,0,0>",
    "z": null,
    "complement": "10-1",
    "inversion": null
  }
];
```

#### Not Search

- Works with !1-1, !^1-1, !1-1$, !@A, !*A, !1-1~2-2
  - ! is equivalent to !` 
  - `! is not a valid search method

```ts
// GET /api/data/number/!1-1
[
  {
    "number": "1-1",
    "primeForm": "[\"0\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "11-1",
    "inversion": null
  },
    ...,
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

#### Exclude Search

- Works with \`1-1, \`^1-1, \`1-1$, \`@A, \`*A, \`1-1~2-2

```ts
// GET /api/data/number/1-1~2-4,`1-1~2-2
[
  {
    "number": "2-3",
    "primeForm": "[\"0\",\"3\"]",
    "vec": "<0,0,1,0,0,0>",
    "z": null,
    "complement": "10-3",
    "inversion": null
  },
  {
    "number": "2-4",
    "primeForm": "[\"0\",\"4\"]",
    "vec": "<0,0,0,1,0,0>",
    "z": null,
    "complement": "10-4",
    "inversion": null
  }
];
```

#### Chaining Methods (no duplicates)

```ts
// GET /api/data/number/1-1,^4-z15,-z50$,1-1~2-1,`4-z15B
[
  {
    "number": "1-1",
    "primeForm": "[\"0\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "11-1",
    "inversion": null
  },
  {
    "number": "4-z15A",
    "primeForm": "[\"0\",\"1\",\"4\",\"6\"]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15B",
    "inversion": "[\"0\",\"2\",\"5\",\"6\"]"
  },
  {
    "number": "6-z50",
    "primeForm": "[\"0\",\"1\",\"4\",\"6\",\"7\",\"9\"]",
    "vec": "<2,2,4,2,3,2>",
    "z": "6-z29",
    "complement": "6-z29",
    "inversion": null
  },
  {
    "number": "2-1",
    "primeForm": "[\"0\",\"1\"]",
    "vec": "<1,0,0,0,0,0>",
    "z": null,
    "complement": "10-1",
    "inversion": null
  }
];
```

### GET /api/data/primeForm/:querySearch/

The endpoint returns an array of objects based on the query on the primeForm property

Use T for 10, E for 11, and C for 12.

- Max URI length: No more than 100 characters
- Subquery length: 2-14 characters
	- Ex. ^0 or !`0123456789TE

#### Exact Search

```ts
// GET /api/data/primeForm/0123
[
  {
    "number": "4-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\"]",
    "vec": "<3,2,1,0,0,0>",
    "z": null,
    "complement": "8-1",
    "inversion": null
  }
];
```

#### Starts With Search

```ts
// GET /api/data/primeForm/^0356
[
  {
    "number": "4-13B",
    "primeForm": "[\"0\",\"3\",\"5\",\"6\"]",
    "vec": "<1,1,2,0,1,1>",
    "z": null,
    "complement": "8-13A",
    "inversion": "[\"0\",\"1\",\"3\",\"6\"]"
  },
  {
    "number": "5-25B",
    "primeForm": "[\"0\",\"3\",\"5\",\"6\",\"8\"]",
    "vec": "<1,2,3,1,2,1>",
    "z": null,
    "complement": "7-25A",
    "inversion": "[\"0\",\"2\",\"3\",\"5\",\"8\"]"
  },
  {
    "number": "5-z36B",
    "primeForm": "[\"0\",\"3\",\"5\",\"6\",\"7\"]",
    "vec": "<2,2,2,1,2,1>",
    "z": "5-z12",
    "complement": "7-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"7\"]"
  },
  {
    "number": "6-z40B",
    "primeForm": "[\"0\",\"3\",\"5\",\"6\",\"7\",\"8\"]",
    "vec": "<3,3,3,2,3,1>",
    "z": "6-z11A",
    "complement": "6-z11A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"8\"]"
  }
];
```

#### Ends With Search

```ts
// GET /api/data/primeForm/2$
[
  {
    "number": "2-2",
    "primeForm": "[\"0\",\"2\"]",
    "vec": "<0,1,0,0,0,0>",
    "z": null,
    "complement": "10-2",
    "inversion": null
  },
  {
    "number": "3-1",
    "primeForm": "[\"0\",\"1\",\"2\"]",
    "vec": "<2,1,0,0,0,0>",
    "z": null,
    "complement": "9-1",
    "inversion": null
  }
];
```

#### Contains Search

```ts
// GET /api/data/primeForm/@12346789
[
  {
    "number": "9-5A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<7,6,6,6,7,4>",
    "z": null,
    "complement": "3-5B",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "10-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<9,8,8,8,8,4>",
    "z": null,
    "complement": "2-1",
    "inversion": null
  },
  {
    "number": "10-6",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"T\"]",
    "vec": "<8,8,8,8,8,5>",
    "z": null,
    "complement": "2-6",
    "inversion": null
  },
  {
    "number": "11-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\"]",
    "vec": "<T,T,T,T,T,5>",
    "z": null,
    "complement": "1-1",
    "inversion": null
  },
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

#### Substring Search

```ts
// GET /api/data/primeForm/*12346789
[
  {
    "number": "9-5A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<7,6,6,6,7,4>",
    "z": null,
    "complement": "3-5B",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "10-6",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"T\"]",
    "vec": "<8,8,8,8,8,5>",
    "z": null,
    "complement": "2-6",
    "inversion": null
  }
];
```

#### Not Search

- Works with !0, !^0, !0$, !@0, !*0,
  - ! is equivalent to !` 
  - `! is not a valid search method
- Use %20 for whitespace equivalent to the empty array for 0-1  

```ts
// GET /api/data/primeForm/!%20
[
  {
    "number": "1-1",
    "primeForm": "[\"0\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "11-1",
    "inversion": null
  },
    ...,
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

#### Exclude Search

- Works with \`0, \`^0, \`0$, \`@0, \`*0

```ts
// GET /api/data/primeForm/01,012,`012
[
  {
    "number": "2-1",
    "primeForm": "[\"0\",\"1\"]",
    "vec": "<1,0,0,0,0,0>",
    "z": null,
    "complement": "10-1",
    "inversion": null
  }
];
```

#### Chaining Methods (no duplicates)

```ts
// GET /api/data/primeForm/%20,^012567,01245$,`@9
[
  {
    "number": "0-1",
    "primeForm": "[\"\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "12-1",
    "inversion": null
  },
  {
    "number": "6-z6",
    "primeForm": "[\"0\",\"1\",\"2\",\"5\",\"6\",\"7\"]",
    "vec": "<4,2,1,2,4,2>",
    "z": "6-z38",
    "complement": "6-z38",
    "inversion": null
  },
  {
    "number": "7-7B",
    "primeForm": "[\"0\",\"1\",\"2\",\"5\",\"6\",\"7\",\"8\"]",
    "vec": "<5,3,2,3,5,3>",
    "z": null,
    "complement": "5-7A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"6\",\"7\",\"8\"]"
  },
  {
    "number": "5-3A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\"]",
    "vec": "<3,2,2,2,1,0>",
    "z": null,
    "complement": "7-3B",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"5\"]"
  }
];
```

### GET /api/data/vec/:querySearch/

The endpoint returns an array of objects based on the query on the vec property

Use T for 10, E for 11, and C for 12.

- Max URI length: No more than 100 characters
- Subquery length: 2-8 characters
	- Ex. ^1 or !`000000
 
#### Exact Search

```ts
// GET /api/data/vec/321000
[
  {
    "number": "4-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\"]",
    "vec": "<3,2,1,0,0,0>",
    "z": null,
    "complement": "8-1",
    "inversion": null
  }
];
```

#### Wildcard Search

```ts
// GET /api/data/vec/1121X1
// capital X must be used as the wildcard
[
  {
    "number": "4-12A",
    "primeForm": "[\"0\",\"2\",\"3\",\"6\"]",
    "vec": "<1,1,2,1,0,1>",
    "z": null,
    "complement": "8-12A",
    "inversion": "[\"0\",\"3\",\"4\",\"6\"]"
  },
  {
    "number": "4-12B",
    "primeForm": "[\"0\",\"3\",\"4\",\"6\"]",
    "vec": "<1,1,2,1,0,1>",
    "z": null,
    "complement": "8-12B",
    "inversion": "[\"0\",\"2\",\"3\",\"6\"]"
  }
];
```

#### Starts With Search

```ts
// GET /api/data/vec/^321
[
  {
    "number": "4-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\"]",
    "vec": "<3,2,1,0,0,0>",
    "z": null,
    "complement": "8-1",
    "inversion": null
  },
  {
    "number": "5-5A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"7\"]",
    "vec": "<3,2,1,1,2,1>",
    "z": null,
    "complement": "7-5B",
    "inversion": "[\"0\",\"4\",\"5\",\"6\",\"7\"]"
  },
  {
    "number": "5-5B",
    "primeForm": "[\"0\",\"4\",\"5\",\"6\",\"7\"]",
    "vec": "<3,2,1,1,2,1>",
    "z": null,
    "complement": "7-5A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"7\"]"
  }
];
```

#### Ends With Search

```ts
// GET /api/data/vec/0111$
[
  {
    "number": "4-5A",
    "primeForm": "[\"0\",\"1\",\"2\",\"6\"]",
    "vec": "<2,1,0,1,1,1>",
    "z": null,
    "complement": "8-5B",
    "inversion": "[\"0\",\"4\",\"5\",\"6\"]"
  },
  {
    "number": "4-5B",
    "primeForm": "[\"0\",\"4\",\"5\",\"6\"]",
    "vec": "<2,1,0,1,1,1>",
    "z": null,
    "complement": "8-5A",
    "inversion": "[\"0\",\"1\",\"2\",\"6\"]"
  }
];
```

#### Contains Search

```ts
// GET /api/data/vec/@3250
[
  {
    "number": "6-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\"]",
    "vec": "<5,4,3,2,1,0>",
    "z": null,
    "complement": null,
    "inversion": null
  },
  {
    "number": "6-32",
    "primeForm": "[\"0\",\"2\",\"4\",\"5\",\"7\",\"9\"]",
    "vec": "<1,4,3,2,5,0>",
    "z": null,
    "complement": null,
    "inversion": null
  }
];
```

#### Substring Search

```ts
// GET /api/data/vec/*3250 or // GET /api/data/vec/*325
[
  {
    "number": "6-32",
    "primeForm": "[\"0\",\"2\",\"4\",\"5\",\"7\",\"9\"]",
    "vec": "<1,4,3,2,5,0>",
    "z": null,
    "complement": null,
    "inversion": null
  }
];
```

#### Not Search

- Works with !0, !^0, !0$, !@0, !*0,
  - ! is equivalent to !` 
  - `! is not a valid search method

```ts
// GET /api/data/primeForm/!000000
[
  {
    "number": "2-1",
    "primeForm": "[\"0\",\"1\"]",
    "vec": "<1,0,0,0,0,0>",
    "z": null,
    "complement": "10-1",
    "inversion": null
  },
    ...,
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

#### Exclude Search

- Works with \`0, \`^0, \`0$, \`@0, \`*0

```ts
// GET /api/data/vec/!000000,`@0,`@1,`@2,`^8,`^6,`@5,`@4,`@7
[
  {
    "number": "7-31A",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"6\",\"7\",\"9\"]",
    "vec": "<3,3,6,3,3,3>",
    "z": null,
    "complement": "5-31B",
    "inversion": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"8\",\"9\"]"
  },
  {
    "number": "7-31B",
    "primeForm": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"8\",\"9\"]",
    "vec": "<3,3,6,3,3,3>",
    "z": null,
    "complement": "5-31A",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"6\",\"7\",\"9\"]"
  },
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

#### Chaining Methods (no duplicates)

```ts
// GET /api/data/vec/321000,^353,441$
[
  {
    "number": "4-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\"]",
    "vec": "<3,2,1,0,0,0>",
    "z": null,
    "complement": "8-1",
    "inversion": null
  },
  {
    "number": "7-24A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"7\",\"9\"]",
    "vec": "<3,5,3,4,4,2>",
    "z": null,
    "complement": "5-24B",
    "inversion": "[\"0\",\"2\",\"4\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "7-24B",
    "primeForm": "[\"0\",\"2\",\"4\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<3,5,3,4,4,2>",
    "z": null,
    "complement": "5-24A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"7\",\"9\"]"
  },
  {
    "number": "7-11A",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"6\",\"8\"]",
    "vec": "<4,4,4,4,4,1>",
    "z": null,
    "complement": "5-11B",
    "inversion": "[\"0\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\"]"
  },
  {
    "number": "7-11B",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\"]",
    "vec": "<4,4,4,4,4,1>",
    "z": null,
    "complement": "5-11A",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"6\",\"8\"]"
  }
];
```

### GET /api/data/vec/:querySearch/:queryInequality/

The endpoint returns an array of objects based on the query on the vec property using inequalities. It checks the truthiness of the chosen inequality for every position.

The endpoint only works with the exact search method as in the /api/data/vec/:querySearch endpoint, you can still use ! and \` to filter out what you do not need. Other inclusion methods (\^\$\@\*) work but do not get effected by :queryInequality.
	- /api/data/vec/:querySearch/e is equivalent to /api/data/vec/:querySearch/

- Max URI length: No more than 100 characters
- Subquery length: 2-8 characters
	- Ex. ^1 or !`000000
- Subquery length for Inequality: 1-2 characters
	- Ex. e or le

#### Equal Search

```ts
// GET /api/data/vec/555553/e
[
  {
    "number": "8-z15A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15B",
    "inversion": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-z15B",
    "primeForm": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"8\",\"9\"]"
  },
  {
    "number": "8-z29A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z15A",
    "complement": "4-z29B",
    "inversion": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-z29B",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z15A",
    "complement": "4-z29A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"9\"]"
  }
];
```


#### Less Than Search

```ts
// GET /api/data/vec/555553/l
[
  {
    "number": "0-1",
    "primeForm": "[\"\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "12-1",
    "inversion": null
  },
    ...
  {
    "number": "7-z38B",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"6\",\"7\",\"8\"]",
    "vec": "<4,3,4,4,4,2>",
    "z": "7-z18A",
    "complement": "5-z38A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"7\",\"8\"]"
  }
];
```

#### Less Than Or Equal To Search

```ts
// GET /api/data/vec/555553/le
[
  {
    "number": "0-1",
    "primeForm": "[\"\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "12-1",
    "inversion": null
  },
    ...
  {
    "number": "8-z29B",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z15A",
    "complement": "4-z29A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"9\"]"
  }
];
```

#### Greater Than Search

```ts
// GET /api/data/vec/555553/g
[
  {
    "number": "9-5A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<7,6,6,6,7,4>",
    "z": null,
    "complement": "3-5B",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
    ...
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

#### Greater Than Or Equal To Search

```ts
// GET /api/data/vec/555553/ge
[
  {
    "number": "8-z15A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15B",
    "inversion": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
    ...
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

### GET /api/data/z/:querySearch/

The endpoint returns an array of objects based on the query on the z property

- Max URI length: No more than 100 characters
- Subquery length: 2-8 characters
	- Ex. ^0 or !`6-z25A

#### Exact Search

```ts
// GET /api/data/z/null
[
  {
    "number": "0-1",
    "primeForm": "[\"\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null
    "complement": "12-1",
    "inversion": null
  },
   ...
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];

// GET /api/data/z/5-z37
[
  {
    "number": "5-z17",
    "primeForm": "[\"0\",\"3\",\"4\",\"5\",\"8\"]",
    "vec": "<2,1,2,3,2,0>",
    "z": "5-z37",
    "complement": "7-z17",
    "inversion": null
  }
];
```

#### Starts With Search

```ts
// GET /api/data/z/^5-z3
[
  {
    "number": "5-z12",
    "primeForm": "[\"0\",\"1\",\"3\",\"5\",\"6\"]",
    "vec": "<2,2,2,1,2,1>",
    "z": "5-z36A",
    "complement": "7-z12",
    "inversion": null
  },
  {
    "number": "5-z17",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"8\"]",
    "vec": "<2,1,2,3,2,0>",
    "z": "5-z37",
    "complement": "7-z17",
    "inversion": null
  },
  {
    "number": "5-z18A",
    "primeForm": "[\"0\",\"1\",\"4\",\"5\",\"7\"]",
    "vec": "<2,1,2,2,2,1>",
    "z": "5-z38A",
    "complement": "7-z18A",
    "inversion": "[\"0\",\"2\",\"3\",\"6\",\"7\"]"
  },
  {
    "number": "5-z18B",
    "primeForm": "[\"0\",\"2\",\"3\",\"6\",\"7\"]",
    "vec": "<2,1,2,2,2,1>",
    "z": "5-z38A",
    "complement": "7-z18B",
    "inversion": "[\"0\",\"1\",\"4\",\"5\",\"7\"]"
  }
];
```

#### Ends With Search

```ts
// GET /api/data/z/23$
[
  {
    "number": "6-z45",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"9\"]",
    "vec": "<2,3,4,2,2,2>",
    "z": "6-z23",
    "complement": "6-z23",
    "inversion": null
  }
];
```

#### Contains Search

```ts
// GET /api/data/z/@45
[
  {
    "number": "4-z29A",
    "primeForm": "[\"0\",\"1\",\"3\",\"7\"]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A",
    "complement": "8-z29B",
    "inversion": "[\"0\",\"4\",\"6\",\"7\"]"
  },
  {
    "number": "4-z29B",
    "primeForm": "[\"0\",\"4\",\"6\",\"7\"]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A",
    "complement": "8-z29A",
    "inversion": "[\"0\",\"1\",\"3\",\"7\"]"
  },
  {
    "number": "6-z23",
    "primeForm": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"8\"]",
    "vec": "<2,3,4,2,2,2>",
    "z": "6-z45",
    "complement": "6-z45",
    "inversion": null
  }
];
```

#### Substring Search

```ts
// GET /api/data/z/*45
[
  {
    "number": "6-z23",
    "primeForm": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"8\"]",
    "vec": "<2,3,4,2,2,2>",
    "z": "6-z45",
    "complement": "6-z45",
    "inversion": null
  }
];
```

#### Not Search

- Works with !1-1, !^1-1, !1-1$, !@A, !*A,
  - ! is equivalent to !` 
  - `! is not a valid search method
- Use %20 for whitespace equivalent to the empty array for 0-1  

```ts
// GET /api/data/z/!null
[
  {
    "number": "4-z15A",
    "primeForm": "[\"0\",\"1\",\"4\",\"6\"]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z29A",
    "complement": "8-z15B",
    "inversion": "[\"0\",\"2\",\"5\",\"6\"]"
  },
    ...,
  {
    "number": "8-z29B",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z15A",
    "complement": "4-z29A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"9\"]"
  }
];
```

#### Exclude Search

- Works with \`1-1, \`^1-1, \`1-1$, \`@A, \`*A

```ts
// GET /api/data/z/7-z12,8-z29A,`7-z12
[
  {
    "number": "8-z15A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15B",
    "inversion": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-z15B",
    "primeForm": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"8\",\"9\"]"
  }
];
```

#### Chaining Methods (no duplicates)

```ts
// GET /api/data/z/8-z29A,^7-z1,-z29A,`7-z18A
[
  {
    "number": "8-z15A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15B",
    "inversion": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-z15B",
    "primeForm": "[\"0\",\"1\",\"3\",\"5\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<5,5,5,5,5,3>",
    "z": "8-z29A",
    "complement": "4-z15A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"6\",\"8\",\"9\"]"
  },
  {
    "number": "7-z36A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"8\"]",
    "vec": "<4,4,4,3,4,2>",
    "z": "7-z12",
    "complement": "5-z36B",
    "inversion": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\"]"
  },
  {
    "number": "7-z36B",
    "primeForm": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\"]",
    "vec": "<4,4,4,3,4,2>",
    "z": "7-z12",
    "complement": "5-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"8\"]"
  },
  {
    "number": "7-z37",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"7\",\"8\"]",
    "vec": "<4,3,4,5,4,1>",
    "z": "7-z17",
    "complement": "5-z37",
    "inversion": null
  }
];
```

### GET /api/data/complement/:querySearch/

The endpoint returns an array of objects based on the query on the complement property

- Max URI length: No more than 100 characters
- Subquery length: 2-8 characters
	- Ex. ^0 or !`6-z25A

#### Exact Search

```ts
// GET /api/data/complement/null
[
  {
    "number": "6-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\"]",
    "vec": "<5,4,3,2,1,0>",
    "z": null,
    "complement": null,
    "inversion": null
  },
   ...
  {
    "number": "6-35",
    "primeForm": "[\"0\",\"2\",\"4\",\"6\",\"8\",\"T\"]",
    "vec": "<0,6,0,6,0,3>",
    "z": null,
    "complement": null,
    "inversion": null
  }
];

// GET /api/data/complement/5-z37
[
  {
    "number": "7-z37",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"7\",\"8\"]",
    "vec": "<4,3,4,5,4,1>",
    "z": "7-z17",
    "complement": "5-z37",
    "inversion": null
  }
];
```

#### Starts With Search

```ts
// GET /api/data/complement/^5-z36
[
  {
    "number": "7-z36A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"8\"]",
    "vec": "<4,4,4,3,4,2>",
    "z": "7-z12",
    "complement": "5-z36B",
    "inversion": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\"]"
  },
  {
    "number": "7-z36B",
    "primeForm": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\"]",
    "vec": "<4,4,4,3,4,2>",
    "z": "7-z12",
    "complement": "5-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"8\"]"
  }
];
```

#### Ends With Search

```ts
// GET /api/data/complement/23$
[
  {
    "number": "4-23",
    "primeForm": "[\"0\",\"2\",\"5\",\"7\"]",
    "vec": "<0,2,1,0,3,0>",
    "z": null,
    "complement": "8-23",
    "inversion": null
  },
  {
    "number": "6-z45",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"9\"]",
    "vec": "<2,3,4,2,2,2>",
    "z": "6-z23",
    "complement": "6-z23",
    "inversion": null
  },
  {
    "number": "8-23",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"7\",\"8\",\"T\"]",
    "vec": "<4,6,5,4,7,2>",
    "z": null,
    "complement": "4-23",
    "inversion": null
  }
];
```

#### Contains Search

```ts
// GET /api/data/complement/@36A
[
  {
    "number": "5-z36B",
    "primeForm": "[\"0\",\"3\",\"5\",\"6\",\"7\"]",
    "vec": "<2,2,2,1,2,1>",
    "z": "5-z12",
    "complement": "7-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"7\"]"
  },
  {
    "number": "6-z3B",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"6\"]",
    "vec": "<4,3,3,2,2,1>",
    "z": "6-z36A",
    "complement": "6-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\"]"
  },
  {
    "number": "6-z10B",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\",\"6\",\"7\"]",
    "vec": "<3,3,3,3,2,1>",
    "z": "6-z39A",
    "complement": "6-z39A",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"7\"]"
  },
  {
    "number": "6-z17B",
    "primeForm": "[\"0\",\"1\",\"4\",\"6\",\"7\",\"8\"]",
    "vec": "<3,2,2,3,3,2>",
    "z": "6-z43A",
    "complement": "6-z43A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"7\",\"8\"]"
  },
  {
    "number": "6-z36B",
    "primeForm": "[\"0\",\"3\",\"4\",\"5\",\"6\",\"7\"]",
    "vec": "<4,3,3,2,2,1>",
    "z": "6-z3A",
    "complement": "6-z3A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"7\"]"
  },
  {
    "number": "7-z36B",
    "primeForm": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\"]",
    "vec": "<4,4,4,3,4,2>",
    "z": "7-z12",
    "complement": "5-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"8\"]"
  }
];
```

#### Substring Search

```ts
// GET /api/data/complement/*36A
[
  {
    "number": "5-z36B",
    "primeForm": "[\"0\",\"3\",\"5\",\"6\",\"7\"]",
    "vec": "<2,2,2,1,2,1>",
    "z": "5-z12",
    "complement": "7-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"7\"]"
  },
  {
    "number": "6-z3B",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"6\"]",
    "vec": "<4,3,3,2,2,1>",
    "z": "6-z36A",
    "complement": "6-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\"]"
  },
  {
    "number": "7-z36B",
    "primeForm": "[\"0\",\"2\",\"3\",\"5\",\"6\",\"7\",\"8\"]",
    "vec": "<4,4,4,3,4,2>",
    "z": "7-z12",
    "complement": "5-z36A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"8\"]"
  }
];
```

#### Not Search

- Works with !1-1, !^1-1, !1-1$, !@A, !*A,
  - ! is equivalent to !` 
  - `! is not a valid search method
- Use %20 for whitespace equivalent to the empty array for 0-1  

```ts
// GET /api/data/complement/!null
[
  {
    "number": "0-1",
    "primeForm": "[\"\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "12-1",
    "inversion": null
  },
    ...,
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];
```

#### Exclude Search

- Works with !1-1, !^1-1, !1-1$, !@A, !*A,

```ts
// GET /api/data/complement/1-1,11-1,`1-1
[
  {
    "number": "1-1",
    "primeForm": "[\"0\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null,
    "complement": "11-1",
    "inversion": null
  }
];
```

#### Chaining Methods (no duplicates)

```ts
// GET /api/data/complement/8-z29A,^7-z1,-z29A,`7-z18A,`B$
[
  {
    "number": "4-z29B",
    "primeForm": "[\"0\",\"4\",\"6\",\"7\"]",
    "vec": "<1,1,1,1,1,1>",
    "z": "4-z15A",
    "complement": "8-z29A",
    "inversion": "[\"0\",\"1\",\"3\",\"7\"]"
  },
  {
    "number": "5-z12",
    "primeForm": "[\"0\",\"1\",\"3\",\"5\",\"6\"]",
    "vec": "<2,2,2,1,2,1>",
    "z": "5-z36A",
    "complement": "7-z12",
    "inversion": null
  },
  {
    "number": "5-z17",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"8\"]",
    "vec": "<2,1,2,3,2,0>",
    "z": "5-z37",
    "complement": "7-z17",
    "inversion": null
  }
];
```
### GET /api/data/inversion/:querySearch/

The endpoint returns an array of objects based on the query on the inversion property

Use T for 10, E for 11, and C for 12.

- Max URI length: No more than 100 characters
- Subquery length: 2-14 characters
	- Ex. ^0 or !`0123456789TE

#### Exact Search

```ts
// GET /api/data/inversion/null
[
  {
    "number": "0-1",
    "primeForm": "[\"\"]",
    "vec": "<0,0,0,0,0,0>",
    "z": null
    "complement": "12-1",
    "inversion": null
  },
   ...
  {
    "number": "12-1",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"T\",\"E\"]",
    "vec": "<C,C,C,C,C,6>",
    "z": null,
    "complement": "0-1",
    "inversion": null
  }
];

// GET /api/data/inversion/026
[
  {
    "number": "3-8B",
    "primeForm": "[\"0\",\"4\",\"6\"]",
    "vec": "<0,1,0,1,0,1>",
    "z": null,
    "complement": "9-8A",
    "inversion": "[\"0\",\"2\",\"6\"]"
  }
];
```

#### Starts With Search

```ts
// GET /api/data/inversion/^02367
[
  {
    "number": "5-z18A",
    "primeForm": "[\"0\",\"1\",\"4\",\"5\",\"7\"]",
    "vec": "<2,1,2,2,2,1>",
    "z": "5-z38A",
    "complement": "7-z18A",
    "inversion": "[\"0\",\"2\",\"3\",\"6\",\"7\"]"
  },
  {
    "number": "6-z43A",
    "primeForm": "[\"0\",\"1\",\"2\",\"5\",\"6\",\"8\"]",
    "vec": "<3,2,2,3,3,2>",
    "z": "6-z17A",
    "complement": "6-z17B",
    "inversion": "[\"0\",\"2\",\"3\",\"6\",\"7\",\"8\"]"
  }
];
```

#### Ends With Search

```ts
// GET /api/data/inversion/23$
[
  {
    "number": "3-2A",
    "primeForm": "[\"0\",\"1\",\"3\"]",
    "vec": "<1,1,1,0,0,0>",
    "z": null,
    "complement": "9-2A",
    "inversion": "[\"0\",\"2\",\"3\"]"
  }
];
```

#### Contains Search

```ts
// GET /api/data/inversion/@45789
[
  {
    "number": "7-27A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"7\",\"9\"]",
    "vec": "<3,4,4,4,5,1>",
    "z": null,
    "complement": "5-27B",
    "inversion": "[\"0\",\"2\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-11A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"7\",\"9\"]",
    "vec": "<5,6,5,5,5,2>",
    "z": null,
    "complement": "4-11B",
    "inversion": "[\"0\",\"2\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-14A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"7\",\"9\"]",
    "vec": "<5,5,5,5,6,2>",
    "z": null,
    "complement": "4-14A",
    "inversion": "[\"0\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-19A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"8\",\"9\"]",
    "vec": "<5,4,5,7,5,2>",
    "z": null,
    "complement": "4-19B",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "9-2A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"9\"]",
    "vec": "<7,7,7,6,6,3>",
    "z": null,
    "complement": "3-2A",
    "inversion": "[\"0\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "9-3A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"8\",\"9\"]",
    "vec": "<7,6,7,7,6,3>",
    "z": null,
    "complement": "3-3B",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "9-4A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\"]",
    "vec": "<7,6,6,7,7,3>",
    "z": null,
    "complement": "3-4B",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "9-4B",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<7,6,6,7,7,3>",
    "z": null,
    "complement": "3-4A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  }
];
```

#### Substring Search

```ts
// GET /api/data/inversion/*45789
[
  {
    "number": "7-27A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"7\",\"9\"]",
    "vec": "<3,4,4,4,5,1>",
    "z": null,
    "complement": "5-27B",
    "inversion": "[\"0\",\"2\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-14A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"7\",\"9\"]",
    "vec": "<5,5,5,5,6,2>",
    "z": null,
    "complement": "4-14A",
    "inversion": "[\"0\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "8-19A",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"8\",\"9\"]",
    "vec": "<5,4,5,7,5,2>",
    "z": null,
    "complement": "4-19B",
    "inversion": "[\"0\",\"1\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  },
  {
    "number": "9-4B",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\"]",
    "vec": "<7,6,6,7,7,3>",
    "z": null,
    "complement": "3-4A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\"]"
  }
];
```

#### Not Search

- Works with !0, !^0, !0$, !@0, !*0,
  - ! is equivalent to !` 
  - `! is not a valid search method
- Use %20 for whitespace equivalent to the empty array for 0-1  

```ts
// GET /api/data/inversion/!null
[
  {
    "number": "3-2A",
    "primeForm": "[\"0\",\"1\",\"3\"]",
    "vec": "<1,1,1,0,0,0>",
    "z": null,
    "complement": "9-2A",
    "inversion": "[\"0\",\"2\",\"3\"]"
  },
    ...,
  {
    "number": "9-11B",
    "primeForm": "[\"0\",\"1\",\"2\",\"4\",\"5\",\"6\",\"7\",\"9\",\"T\"]",
    "vec": "<6,6,7,7,7,3>",
    "z": null,
    "complement": "3-11A",
    "inversion": "[\"0\",\"1\",\"2\",\"3\",\"5\",\"6\",\"7\",\"9\",\"T\"]"
  }
];
```

#### Exclude Search

- Works with \`0, \`^0, \`0$, \`@0, \`*0

```ts
// GET /api/data/inversion/0124,01245,`0124
[
  {
    "number": "5-3B",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\"]",
    "vec": "<3,2,2,2,1,0>",
    "z": null,
    "complement": "7-3A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"5\"]"
  }
];
```

#### Chaining Methods (no duplicates)

```ts
// GET /api/data/inversion/0124,^012567,01245$,`@9
[
  {
    "number": "4-2B",
    "primeForm": "[\"0\",\"2\",\"3\",\"4\"]",
    "vec": "<2,2,1,1,0,0>",
    "z": null,
    "complement": "8-2A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\"]"
  },
  {
    "number": "7-7A",
    "primeForm": "[\"0\",\"1\",\"2\",\"3\",\"6\",\"7\",\"8\"]",
    "vec": "<5,3,2,3,5,3>",
    "z": null,
    "complement": "5-7B",
    "inversion": "[\"0\",\"1\",\"2\",\"5\",\"6\",\"7\",\"8\"]"
  },
  {
    "number": "5-3B",
    "primeForm": "[\"0\",\"1\",\"3\",\"4\",\"5\"]",
    "vec": "<3,2,2,2,1,0>",
    "z": null,
    "complement": "7-3A",
    "inversion": "[\"0\",\"1\",\"2\",\"4\",\"5\"]"
  }
];
```

### GET /api/data/:queryProp/PROPERTY/:querySearch/

Using the GET /api/data/:queryProp endpoint you can filter out the properties you want from the resulting querySearch

Lengths For :queryProp\:
- Max URI length: No more than 43 characters
- Subquery length: 1-10 characters

##### Endpoints:
- /api/data/:queryProp/number/:querySearch/
- /api/data/:queryProp/primeForm/:querySearch/
- /api/data/:queryProp/vec/:querySearch/
- /api/data/:queryProp/vec/:querySearch/:queryInequality/
- /api/data/:queryProp/z/:querySearch/
- /api/data/:queryProp/complement/:querySearch/
- /api/data/:queryProp/inversion/:querySearch/

```ts
// GET /api/data/primeForm/number/1-1
[
  {
    "primeForm": "[\"0\"]"
  }
];

// GET /api/data/number,primeForm/number/1-1
[
  {
    "number": "1-1",
    "primeForm": "[\"0\"]"
  }
];
```

### GET /api/data/d3/:querySearch/

The endpoint returns either json for a valid d3dag graph or json for valid dag links

A option for forte numbers, encoded like this "[\"0\"]|1-1|000000", is added to allow the ability to toggle between primeForm, number, and vec on a d3dag by splitting on "|"

- Max URI length: No more than 22 characters

#### Types
```ts
type Links = { source: string; target: string }[];
type DagJSONObject = {
	size: { width: number; height: number };
	nodes: { x: number; y: number; data: string }[];
	links: { source: string; target: string; points: number[][]; data: Links };
	v: number;
};
```

#### Cardinality-Increasing vs Strict-Increasing

The operations here are done on the primeForm property.

Cardinality-increasing here means the target set is a proper superset of the source set where the target set is greater in length by 1

```ts
  {
    "source": "[\"0\"]",
    "target": "[\"0\",\"1\"]"
  }
```

Strict-increasing here means the target set is a proper superset of the source set where the target set is greater in length by 1 AND the next number of the target set must be greater than the largest number in source set (lexicographically greater).

When comparing [\"0\",\"2\",\"3\",\"4\"] > [\"0\",\"2\",\"3\"], it returns true
While comparing [\"0\",\"1\",\"3\",\"4\"] > [\"0\",\"2\",\"3\"], it returns false
```ts
  {
    "source": "[\"0\",\"2\",\"3\"]",
    "target": "[\"0\",\"2\",\"3\",\"4\"]"
  }
```

#### Vector-Similarity

The operations here are done on the vec property.

Vectors are compared using cosine similarity and are linked to the set with the highest cosine similarity.

#### Original vs Inversion

Original means no inversions (no B sets), but sets are still labelled 3-11A instead of 3-11.

Inversion means with inversions so it includes both A and B sets.

#### Manual Construction

The json files here can be recreated using the set_classes.json file.

##### Fetch

```ts
type Link = { source: string; target: string }
const links = ref<null | Link[]>(null)

const fetchData = async () => {
  try {
    const res = await fetch(
      'https://hcda8f8dtk.execute-api.us-east-1.amazonaws.com/prod/api/data/number,primeForm,vec/',
      { signal: abortController.signal }
    )
    if (res.ok) {
      const data: { number: string; primeForm: string; vec: string }[] = await res.json()
      links.value = linkBuilder(data)
      localStorage.setItem('links', JSON.stringify(links.value))
    } else {
      console.log('Not 200')
    }
  } catch (error) {
    if ((error as Error).name == 'AbortError') {
      console.log('AbortError', error)
    }
    console.log(error)
  }
}
```

##### Links
```ts
// Cardinality-Increasing
const linkBuilder = (
  data: { number: string; primeForm: string; vec: string }[]
) => {
  const newData: { number: string; primeForm: string[]; vec: string }[] = data.map((s) => ({
    primeForm: s.primeForm.slice(1, -1).split(','),
    number: s.number,
    vec: s.vec
  }))
  let links: Link[] = [{ source: '[""]|0-1|000000', target: '["0"]|1-1|000000' }]

  for (const s of newData) {
    for (const t of newData) {
      if (
        s.primeForm.every((e) => t.primeForm.includes(e)) &&
        s.primeForm.length === t.primeForm.length - 1
      ) {
        links.push({
          source:
            '[' + s.primeForm.toString() + ']' + '|' + s.number + '|' + s.vec.replace(/\D/g, ''),
          target:
            '[' + t.primeForm.toString() + ']' + '|' + t.number + '|' + t.vec.replace(/\D/g, '')
        })
      }
    }
  }
  return links
}

// Strictly-Increasing
const linkBuilder = (
  data: { number: string; primeForm: string; vec: string }[]
) => {
  const newData: { number: string; primeForm: string[]; vec: string }[] = data.map((s) => ({
    primeForm: s.primeForm.slice(1, -1).split(','),
    number: s.number,
    vec: s.vec
  }))
  let links: Link[] = [{ source: '[""]|0-1|000000', target: '["0"]|1-1|000000' }]

  for (const s of newData) {
    for (const t of newData) {
      if (
        s.primeForm.every((e) => t.primeForm.includes(e)) &&
        s.primeForm.length === t.primeForm.length - 1 &&
        t.primeForm > s.primeForm
      ) {
        links.push({
          source:
            '[' + s.primeForm.toString() + ']' + '|' + s.number + '|' + s.vec.replace(/\D/g, ''),
          target:
            '[' + t.primeForm.toString() + ']' + '|' + t.number + '|' + t.vec.replace(/\D/g, '')
        })
      }
    }
  }
  return links
}

// Vector-Similarity
const linkBuilder = (
  data: { number: string; primeForm: string; vec: string }[]
) => {
  const newData: { number: string; primeForm: string[]; vec: string }[] = data.map((s) => ({
    primeForm: s.primeForm.slice(1, -1).split(','),
    number: s.number,
    vec: s.vec
  }))
  let links: Link[] = [{ source: '[""]|0-1|000000', target: '["0"]|1-1|000000' }]

  for (const [i, s] of newData.entries()) {
    let max = 0
    let newS = null
    let newT = null
    for (const [j, t] of newData.entries()) {
      const sVec = s.vec.replace(/[<>]/g, '').replace(/C/g, '12').replace(/T/g, '10').split(',')
      const tVec = t.vec.replace(/[<>]/g, '').replace(/C/g, '12').replace(/T/g, '10').split(',')

      const dotProd = tVec
        .map((a, i) => parseInt(a) * parseInt(sVec[i]))
        .reduce((acc, curr) => acc + curr, 0)
      const cosSim =
        dotProd /
        (Math.sqrt(sVec.reduce((sum, val) => sum + parseInt(val) * parseInt(val), 0)) *
          Math.sqrt(tVec.reduce((sum, val) => sum + parseInt(val) * parseInt(val), 0)))

      if (i < j && cosSim > max) {
        max = cosSim
        newS = s
        newT = t
      }
    }
    if (newS && newT) {
      links.push({
        source:
          '[' +
          newS.primeForm.toString() +
          ']' +
          '|' +
          newS.number +
          '|' +
          newS.vec.replace(/(?![TEC])\D/g, ''),
        target:
          '[' +
          newT.primeForm.toString() +
          ']' +
          '|' +
          newT.number +
          '|' +
          newT.vec.replace(/(?![TEC])\D/g, '')
      })
    }
  }
  return links
}

// For original dags add this to the condition
!s.number.endsWith('B') &&
!t.number.endsWith('B')
```

##### Dag

```ts
import * as d3 from 'd3'
import * from 'd3-dag'
const builder = graphConnect()
    .sourceId(({ source }: { source: string }) => source)
    .targetId(({ target }: { target: string }) => target)
const dagBuild = builder(links.value)
const layout = sugiyama()
    .layering(layeringSimplex())
    .decross(decrossTwoLayer().order(twolayerGreedy().base(twolayerAgg())))
    .coord(coordSimplex())
    .nodeSize([2 * NODE_RADIUS, 2 * NODE_RADIUS])
    .gap([NODE_RADIUS, NODE_RADIUS])
    .tweaks([tweakShape([2 * NODE_RADIUS, 2 * NODE_RADIUS], shapeEllipse)])

const { width, height } = layout(dagBuild as any)

JSON.stringify(dagBuild) // NOTE: I added size property with width and height during post-processing, it is not a default property returned in the JSON by d3dag
```

#### How to Use JSON in D3Dag

```ts
type Link = { source: string; target: string }
type DagJSONObject = {
	size: { width: number; height: number };
	nodes: { x: number; y: number; data: string }[];
	links: { source: string; target: string; points: number[][]; data: Link[] };
	v: number;
};

const res = await fetch('.../api/data/d3/strictdagprimeform/')
const data: DagJSONObject = await res.json() 
const size: {width: number, height: number} = data.size // use to adjust the starting position of the graph or set the graph size

const builder = graphJson()
      .nodeDatum((data) => data as string)
      .linkDatum((data) => data as Link)
const dag = builder(JSON.parse(data))
// perform d3 visualizations using dag.nodes() and dag.links()
```

#### Endpoints

Valid queries are:
  - cardinalinversiondag
  - cardinalinversionlinks
  - cardinaloriginaldag
  - cardinaloriginallinks
  - strictinversiondag
  - strictinversionlinks
  - strictoriginaldag
  - strictoriginallinks
  - vectorinversiondag
  - vectorinversionlinks
  - vectororiginaldag
  - vectororiginallinks

## API Development

Run ```npm i```

### Add .env File

```env
NODE_ENV=development
PORT=[choose any port]
```

## Star This Repo

If you like this API, please give it a star! _\~ Created by Khang Tran_
