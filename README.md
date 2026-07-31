# Determinist
A deterministic password generator so you never forget your passwords.

## Features
- Deterministic output
- Fast generation
- Secure master pass encryption using Argon2
- Easy password recovery
- CLI and prompted mode

## Installation
### pipx (Recommended):
1. If you don't have pipx installed yet, follow the official [installation guide](https://pipx.pypa.io/stable/how-to/install-pipx.html).
2. Download the latest wheel file from the [Releases](https://github.com/szentpeterimate/determinist/releases/latest) page
3. Install Determinist with `pipx install determinist.whl` (Make sure to enter the filename correctly!)
> Important! Determinist was built with pipx version **1.16.5**. Make sure you have the latest version installed.
### pip:
1. Download the latest wheel file from the [Releases](https://github.com/szentpeterimate/determinist/releases/latest) page
2. Install Determinist with `pip install determinist.whl` (Make sure to enter the filename correctly!)
> This tool is meant to be used from the terminal. Only install using pip if you know what you're doing!

## How to use
After installing, simply run `determinist` to get started.
### Arguments (Required)
- `master_pass`: This is your master key, treat it like you'd treat your passwords. Make it secure but easy to remember, and don't share it!
- `site_name`: This is the salt used for the Argon2 hashing. If you're using v1, this **must be at least 8 characters long**. If using v2, it can be any length.
### Options
- `--version` / `-v`: The algorithm version. (1 or 2)
- `--length` / `-l`: The final length of your password. (6-32 characters)
#### Algorithm Specific
These can be omitted (left default) if you're using one version over the other.
- `--mode` / `-m`: The special character mode used in v1. `replace` will replace certain characters according to the character map provided with the next command. `insert` inserts a special character from a list (see `--special`) every Nth character.
- `--map` / `-M`: The character map used in v1. Use the JSON format. (e.g.: `'{"a": ".", "b": "-"}'`)
- `--special` / `-s`: The special characters used by v1. Write in string form, without separation (`.-,^$&`)
- `--chars` / `-c`: The character set used in v2. Separate them by commas **without spaces**. (`special,lowercase,uppercase,digits`)

## Examples
1. Using `generate`:
<img src="/media/demo_generate.gif"></img>

2. Using `prompt`:
<img src="/media/demo_prompt.gif"></img>

## Disclaimer
Determinist is purely a **password generator**. Read more [here](/DISCLAIMER)