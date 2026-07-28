from typing import Literal, List
from string import punctuation
from .algorithms import v1, v2

class Generator:

    def generate_password(self, version: int, master_pass: str, site_name: str, pass_length: int = 8, spec_mode: Literal["replace", "insert"] = "insert", char_map: dict[str, str] = {}, spec_chars: list = list(punctuation), spec_freq: int = 4, char_types: list[Literal["special", "lowercase", "uppercase", "digits"]] = ["special", "lowercase", "uppercase", "digits"]) -> str:
        if version == 1:
            return v1.generate(master_pass=master_pass, site_name=site_name, pass_length=pass_length, spec_mode=spec_mode, spec_chars=spec_chars, char_map=char_map, spec_freq=spec_freq)
        if version == 2:
            return v2.generate(master_pass=master_pass, site_name=site_name, pass_length=pass_length, char_map=char_map, char_types=char_types)
        else:
            raise ValueError(f"Unsupported algorithm version: {version}")