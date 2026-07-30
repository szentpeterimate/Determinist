import typer
import json
from typing import Literal, Annotated
from string import punctuation
from .algorithms import v1, v2
from rich import print

app = typer.Typer()

@app.command()
def generate_password(master_pass: Annotated[str, typer.Argument()], 
                      site_name: Annotated[str, typer.Argument()], 
                      char_map: Annotated[str, typer.Option("--map", "-M")] = "{}", 
                      spec_chars: Annotated[str, typer.Option("--special", "-s")] = punctuation, 
                      version: Annotated[int, typer.Option("--version", "-v", min=1, max=2)] = 2, 
                      pass_length: Annotated[int, typer.Option("--length", "-l", min=6, max=32)] = 8, 
                      spec_mode: Annotated[Literal["replace", "insert"], typer.Option("--mode", "-m")] = "insert",
                      spec_freq: Annotated[int, typer.Option("--frequency", "-f")] = 4, 
                      char_types: Annotated[str, typer.Option("--chars", "-c")] = "special,lowercase,uppercase,digits"
                     ):

    char_map_dict = json.loads(char_map)

    spec_chars_list = list(spec_chars)

    char_types_list = char_types.split(',')
    
    if version == 1:
        return v1.generate(master_pass=master_pass, site_name=site_name, pass_length=pass_length, spec_mode=spec_mode, spec_chars=spec_chars_list, char_map=char_map_dict, spec_freq=spec_freq)
    elif version == 2:
        return v2.generate(master_pass=master_pass, site_name=site_name, pass_length=pass_length, char_map=char_map_dict, char_types=char_types_list)
    else:
        raise ValueError(f"Unsupported algorithm version: {version}")