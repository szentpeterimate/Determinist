from pathlib import Path
from platformdirs import user_config_dir
import tomllib

class ConfigHandler:
    def __init__(self):
        self.config_path = Path(user_config_dir("determinist", appauthor=False))
        self.config_file = self.config_path / "default.toml"
        self.presets_path = self.config_path / "presets"

        self.config_path.mkdir(parents=True, exist_ok=True)
        self.presets_path.mkdir(parents=True, exist_ok=True)

    def load_default(self) -> dict:
        if not self.config_file.is_file():
            default_config = "[config]\nmeow = false\n"
            self.config_file.write_text(default_config, encoding="utf-8")

        with open(self.config_file, 'rb') as f:
            return tomllib.load(f)

    def save_config(self, file: str):
        path = Path(file)
        target_path = self.presets_path / path.name

        path.copy(target_path)