# changelog-generator

- [Description](#Description)
- [Installation](#Installation)
- [Usage](#Usage)
  - [Init](#Init)
  - [First start](#First-start)
  - [Manual mode](#Manual-mode)
  - [Automatic mode](#Automatic-mode)
- [Options](#Options)
- [Contacts](#Contacts)

## Description
*Change-gen* util for generates your changelog from git commits.

## Installation
Locally to the project: `npm i --save-dev change-gen` or` yarn add -D change-gen`.
Globally: `npm i -g change-gen` or` yarn global add change-gen`

## Usage
There are two options for using the utility:
- fully [automatic](#Automatic-mode) mode (implemented for js projects)
- [manual](#Manual-mode) (available for projects in any language).

### Init
To start, you need to initialize the configuration file, for this run `change-gen init`
at the root of your repository and follow the instructions. As a result, the configuration file `cg.config.json` will appear in the root of your project.

### First start
If before that you wrote a changelog by hand, you should run the program for the first time in [manual mode](#Manual-mode) too.

### Manual mode
In manual mode, enter `change-gen gen --from-commit <fullHash> --to-commit <fullHash> --release-date 2020-12-20 --release-version 0.1.0`
Where `--from-commit` is the most recent commit and` --to-commit` is the oldest commit.

### Automatic mode
If you have a JS-project, run change-gen gen and that's it, otherwise, see [manual mode] (# Manual-mode). The generator will find the last commit in the previous release by itself and, based on this, will generate a new release until the last commit. You can also specify the release date (if you need to specify not today) and the version (by default taken from package.json) change-gen gen --release-date 2020-12-20 --release-version 0.1.0.

## Options
To view the list of options, use:

`change-gen help`

## Contacts
- Fedosov Nikita (fedosov.ni@esphere.ru)


