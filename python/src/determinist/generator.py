from typing import Literal
from string import punctuation
from .algorithms import v1

class Generator:
    def __init__(self, version: int, char_map: dict[str, str] = {'a': '$', 'h': '(', 'z': '&'}, spec_chars: list = list(punctuation), spec_mode: Literal["replace", "insert"] = "insert", pass_length: int = 8, spec_freq: int = 4) -> None:
        self.version = version
        self.char_map = char_map
        self.spec_chars = spec_chars
        self.pass_length = pass_length
        self.spec_mode: Literal["replace", "insert"] = spec_mode
        self.spec_freq = spec_freq

    def generate_password(self, master_pass: str, site_name: str) -> str:
        if self.version == 1:
            return v1.generate(master_pass=master_pass, site_name=site_name, pass_length=self.pass_length, spec_mode=self.spec_mode, spec_chars=self.spec_chars, char_map=self.char_map, spec_freq=self.spec_freq)
        else:
            raise ValueError(f"Unsupported algorithm version: {self.version}")