import typer
import json
from typing import Literal, Annotated, Optional
from string import punctuation
from .algorithms import v1, v2
from rich import print, box
from rich.table import Table
from rich.prompt import Prompt
from .config_handler import ConfigHandler
from pathlib import Path
from itertools import zip_longest

app = typer.Typer()

presets_app = typer.Typer()
app.add_typer(presets_app, name="presets")

generate_app = typer.Typer()
app.add_typer(generate_app, name="generate")

ch = ConfigHandler()

def generate_password(master_pass: str, 
                      site_name: str, 
                      char_map: dict[str, str] = {}, 
                      spec_chars: list = list(punctuation), 
                      version: int = 2, 
                      pass_length: int = 8, 
                      spec_mode: Literal["replace", "insert"] = "insert",
                      spec_freq: int = 4, 
                      char_types: list = ["special","lowercase","uppercase","digits"]
                     ) -> str:
    
    if version == 1:
        return v1.generate(master_pass=master_pass, site_name=site_name, pass_length=pass_length, spec_mode=spec_mode, spec_chars=spec_chars, char_map=char_map, spec_freq=spec_freq)
    elif version == 2:
        return v2.generate(master_pass=master_pass, site_name=site_name, pass_length=pass_length, char_map=char_map, char_types=char_types)
    else:
        raise ValueError(f"Unsupported algorithm version: {version}")

@generate_app.callback(invoke_without_command=True)
def generate_password_cli(ctx: typer.Context,
                      master_pass: Annotated[Optional[str], typer.Option("--master", "-M")] = None,
                      site_name: Annotated[Optional[str], typer.Option("--site", "-n")] = None,
                      use_preset: Annotated[bool, typer.Option("--preset", "-p")] = False,
                      version: Annotated[int, typer.Option("--version", "-v", min=1, max=2)] = 2, 
                      pass_length: Annotated[int, typer.Option("--length", "-l", min=6, max=32)] = 8, 
                      char_map: Annotated[str, typer.Option("--map")] = "{}", 
                      spec_chars: Annotated[str, typer.Option("--special", "-s")] = punctuation, 
                      spec_mode: Annotated[Literal["replace", "insert"], typer.Option("--mode", "-m")] = "insert",
                      spec_freq: Annotated[int, typer.Option("--frequency", "-f")] = 4, 
                      char_types: Annotated[str, typer.Option("--chars", "-c")] = "special,lowercase,uppercase,digits",
                     ):
    if ctx.invoked_subcommand is None:
        if not master_pass:
            master_pass = typer.prompt("Master pass")
            assert master_pass is not None
        if not site_name:
            site_name = typer.prompt("Master pass")
            assert site_name is not None

        content = {}
        if use_preset == True:
            chosen_file = Prompt.ask("Select a file", choices=ch.get_files("name"), default=ch.get_files("default")[0])
            content = ch.load_config(chosen_file.lower())

            version = content["general"]["version"]
            pass_length = content["general"]["pass_length"]

            spec_mode = content["v1"]["spec_mode"]
            spec_freq = content["v1"]["spec_freq"]
            spec_chars = content["v1"]["spec_chars"]
            char_map = content["v1"]["char_map"]

            char_types = content["v2"]["char_types"]
        else:
            pass

        char_map_dict = (
            char_map if isinstance(char_map, dict) else json.loads(char_map)
        )
        spec_chars_list = (
            spec_chars if isinstance(spec_chars, list) else list(spec_chars)
        )
        char_types_list = (
            char_types if isinstance(char_types, list) else char_types.split(",")
        )

        password = generate_password(master_pass=master_pass, site_name=site_name, char_map=char_map_dict, char_types=char_types_list, pass_length=pass_length, version=version, spec_mode=spec_mode, spec_chars=spec_chars_list, spec_freq=spec_freq)

        success_table = Table(box=box.SIMPLE_HEAD, show_edge=False)
        success_table.add_column("Password Generation Successful!", justify="center")
        success_table.add_row(f"Password: [bold cyan]{password}[/]")

        print(success_table)

@generate_app.command(name="prompt")
def generate_password_prompt(
                      master_pass: Annotated[str, typer.Option(prompt="Master pass")], 
                      site_name: Annotated[str, typer.Option(prompt="Site name")], 
                      version: Annotated[int, typer.Option(min=1, max=2, prompt="version (1/2)")] = 2,
                      pass_length: Annotated[int, typer.Option(min=6, max=32, prompt="Password length (6-32)")] = 8, 
                      char_map: Annotated[str, typer.Option(prompt="Character map (dict, v1)")] = "{}", 
                      spec_chars: Annotated[str, typer.Option(prompt="Special characters (v1)")] = punctuation, 
                      spec_mode: Annotated[Literal["replace", "insert"], typer.Option(prompt="Special character mode (v1)")] = "insert",
                      spec_freq: Annotated[int, typer.Option(prompt="Special character frequency (v1)")] = 4, 
                      char_types: Annotated[str, typer.Option(prompt="Character types (v2)")] = "special,lowercase,uppercase,digits"
                     ):
    
    char_map_dict = json.loads(char_map)
    spec_chars_list = list(spec_chars)
    char_types_list = char_types.split(',')

    password = generate_password(master_pass=master_pass, site_name=site_name, char_map=char_map_dict, char_types=char_types_list, pass_length=pass_length, version=version, spec_mode=spec_mode, spec_chars=spec_chars_list, spec_freq=spec_freq)

    success_table = Table(box=box.SIMPLE_HEAD, show_edge=False)
    success_table.add_column("\nPassword Generation Successful!", justify="center")
    success_table.add_row(f"Password: [bold cyan]{password}[/]")

    print(success_table)

@presets_app.callback(invoke_without_command=True)
def list_presets(ctx: typer.Context):
    details = {name: {"description": desc, "path": str(path), "is_default": default} for name, desc, path, default in zip_longest(ch.get_files("name"), ch.get_files("description"), ch.get_files("path"), ch.get_files("default"))}

    preset_table = Table(box=box.SIMPLE_HEAD, show_edge=False)
    preset_table.add_column("Preset")
    preset_table.add_column("Description")
    preset_table.add_column("Path")
    preset_table.add_column("Default?")

    for i, j in details.items():
        preset_table.add_row(i, j["description"], j["path"], "True" if j["is_default"] == i else "False")

    if ctx.invoked_subcommand == None:
        print(preset_table)

@presets_app.command(name="save")
def save_preset(path: Annotated[Path, typer.Argument(dir_okay=False, file_okay=True, exists=True)]):
    ch.save_config(path)

@presets_app.command(name="delete")
def delete_preset(file_name: Annotated[str, typer.Argument()], force: Annotated[bool, typer.Option("--force")] = False):
    ch.delete_config(file_name, force)