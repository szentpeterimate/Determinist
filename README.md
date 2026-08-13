# Determinist
A deterministic password generator so you never forget your passwords.

## V2 Algorithm Notice
The current implementation of the V2 algorithm uses the entire Argon2 output instead of the hash, including the identifiers in the beginning. This is not a huge safety issue, but it will be fixed in the next algorithm version, and Determinist will stay backwards compatible will previous algorithm versions.

## Features
- Deterministic output
- Fast generation
- Secure master pass encryption using Argon2
- Easy password recovery
- TOML preset support

## Installation
### pipx (Recommended):
1. If you don't have pipx installed yet, follow the official [installation guide](https://pipx.pypa.io/stable/how-to/install-pipx.html)
2. Install Determinist with `pipx install determinist`
> Important! Determinist was built with pipx version **1.16.5**. Make sure you have the latest version installed.
### pip:
- Install Determinist with `pip install determinist`
> This tool is meant to be used from the terminal. Only install using pip if you know what you're doing!

## How to use
### Web
Just enter your master password, the name of the site you'd like to generate a password for, and optionally customize the other settings as you wish, and click generate! 

#### Note
The Determinist website does NOT connect to any servers other than GitHub. All your information is safe, and is not stored locally or on any server, as the entire generation process is client-side.

### CLI
- `generate`: This will run the generation, you can use the options below with it. You can also omit the master and site, as Determinist will prompt you for them if you do
    - `generate prompt`: The `prompt` subcommand will prompt you for every option, no need to write them yourself

- `presets`: This command will list all the details about your saved presets
    - `presets save [PATH]`: you'll need to provide a path, and this command saves the preset for you
    - `presets delete [PRESET NAME]`: giving the name of the preset you'd like to delete will permanently remove it
    - `presets default [PRESET NAME]` will set the selected preset as the default

    ### Options
    - `--master` / `-M`: This is your master key, treat it like you'd treat your passwords. Make it secure but easy to remember, and don't share it
    - `--site` / `-n`: This is the salt used for the Argon2 hashing. **If you're using v1, this must be at least 8 characters long**. If using v2, it can be any length
    - `--version` / `-v`: The algorithm version
    - `--length` / `-l`: The final length of your password
    #### Algorithm Specific
    These can be omitted (left default) if you're using one version over the other.
    #### V1
    - `--mode` / `-m`: The special character mode. `replace` will replace certain characters according to the character map provided with the next command. `insert` inserts a special character from a list (see `--special`) every Nth character
    - `--map`: The character map, enter this in JSON format inside a string
    - `--special` / `-s`: The special characters used. Write in string form, without separation
    #### V2
    - `--chars` / `-c`: The character set used in v2. Separate them by commas **without spaces**

## Examples
1. Using `generate`:
<img src="/media/demo_generate.gif"></img>

2. Using `prompt`:
<img src="/media/demo_prompt.gif"></img>

## Disclaimer
Determinist is purely a **password generator**. Read more [here](/DISCLAIMER.md)
