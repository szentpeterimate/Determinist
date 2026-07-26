from argon2.low_level import Type, hash_secret
from typing import Literal
from string import punctuation, ascii_lowercase, ascii_uppercase, digits
from random import Random

def generate(master_pass: str, site_name: str, pass_length: int, spec_mode: Literal["replace", "insert"], char_map: dict[str, str], spec_chars: list, spec_freq: int, char_types: list) -> str:

    salt = site_name + str(pass_length) + spec_mode + str(char_map) + str(spec_chars) + str(spec_freq) + str(char_types)

    random = Random(salt)

    charset = ""
    for i in char_types:
        if i == "lowercase":
            charset += ascii_lowercase
        elif i == "uppercase":
            charset += ascii_uppercase
        elif i == "digits":
            charset += digits

    hashed_bytes = hash_secret(secret=master_pass.encode('utf-8'),
                                salt=salt.encode('utf-8'),
                                time_cost=2,
                                memory_cost=65536,
                                parallelism=4,
                                hash_len=32,
                                type=Type.ID
                            )

    random.shuffle(spec_chars)

    return ""