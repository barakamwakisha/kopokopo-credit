# kopokopo-credit
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fbarakamwakisha%2Fkopokopo-credit%2Fbadge%3Fref%3Dmaster&style=flat&label=Tests)](https://actions-badge.atrox.dev/barakamwakisha/kopokopo-credit/goto?ref=master)

A program that determines KopoKopo's customers' credit scores based on their past transactions, for the Junior Software Engineer Role.
Written in NodeJS with TypeScript.
## Prerequisites
You need NodeJS / npm and or yarn installed on your machine

## Instructions

Clone this repository

Install dependencies by running
`yarn` or `npm install`

Run the command below to compile the project

`yarn compile` or `npm run compile`

Run the command below, passing the csv file path (wrapped in double quotes) as the first argument and the limit(n) as the second argument

`node dist/index.js "CSV_FILE_PATH_HERE" LIMIT_HERE`