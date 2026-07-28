from argon2.low_level import Type, hash_secret
from typing import Literal
from string import punctuation, ascii_lowercase, ascii_uppercase, digits
from random import Random
from io import BytesIO

def generate(master_pass: str, site_name: str, pass_length: int, char_map: dict[str, str], char_types: list) -> str:

    salt = master_pass + site_name + str(pass_length) + str(char_map) + str(char_types)

    random = Random(salt)

    charset = ""
    for i in char_types:
        if i == "lowercase":
            charset += ascii_lowercase
        elif i == "uppercase":
            charset += ascii_uppercase
        elif i == "digits":
            charset += digits
        elif i == "special":
            charset += punctuation

    charset_list = list(charset)

    random.shuffle(charset_list)

    hashed_bytes = hash_secret(secret=master_pass.encode('utf-8'),
                                salt=salt.encode('utf-8'),
                                time_cost=2,
                                memory_cost=65536,
                                parallelism=4,
                                hash_len=32*pass_length,
                                type=Type.ID
                            )
    stream = BytesIO(hashed_bytes)

    password = ""

    limit = 256 - (256 % len(charset_list))
    for i, _ in enumerate(hashed_bytes):
        byte = stream.getvalue()[i]
        if i == pass_length:
            break
        elif byte < limit:
            password += charset_list[byte % len(charset_list)]

    password_to_shuffle = list(password)
    random.shuffle(password_to_shuffle)

    final = "".join(password_to_shuffle)

    return final