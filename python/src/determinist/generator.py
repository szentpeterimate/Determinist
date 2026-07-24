import argon2
from argon2.low_level import Type, hash_secret
from typing import Literal, final
from string import punctuation

class Generator:
    def __init__(self, char_map: dict[str, str] = {'a': '$', 'h': '(', 'z': '&'}, spec_chars: list = list(punctuation), spec_mode: Literal["replace", "insert"] = "insert", pass_length: int = 8, spec_freq: int = 4) -> None:
        self.char_map = char_map
        self.spec_chars = spec_chars
        self.pass_length = pass_length
        self.spec_mode = spec_mode
        self.spec_freq = spec_freq

    def generate_password(self, master_pass: str, site_name: str) -> str:
        hashed_str = hash_secret(secret=master_pass.encode('utf-8'),
                                 salt=site_name.encode('utf-8'),
                                 time_cost=2,
                                 memory_cost=65536,
                                 parallelism=4,
                                 hash_len=32,
                                 type=Type.ID
                                ).decode('utf-8')
        stripped = hashed_str.split('$')[-1]

        chars_added = ""
        if self.spec_mode == "insert":
            for i, char in enumerate(stripped):
                chars_added += char
                if (i + 1) % self.spec_freq == 0:
                    chars_added += self.spec_chars[i % len(self.spec_chars)]
        elif self.spec_mode == "replace":
            for _, char in enumerate(stripped):
                if char.lower() in self.char_map:
                    chars_added += self.char_map[char.lower()]
                else:
                    chars_added += char

        final_password = chars_added[-self.pass_length:]

        return final_password