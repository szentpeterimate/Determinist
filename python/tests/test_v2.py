import unittest

from determinist import Generator
from unittest import TestCase

class TestGenV2(TestCase):
    def test_deterministic_output(self):
        gen = Generator(version=2)
        self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "github.com"), "8)<wCp:^")

    def test_site_changes_output(self):
        gen = Generator(version=2)
        self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "reddit.com"), "FCqfNj[!")

    def test_master_changes_output(self):
        gen = Generator(version=2)
        self.assertEqual(gen.generate_password("Another-Very-Strong-Passphrase", "github.com"), "m2%VYq'Q")

    def test_length(self):
        gen = Generator(version=2, pass_length=12)
        self.assertEqual(len(gen.generate_password("Very-Strong-Passphrase", "github.com")), 12)

    def test_replace(self):
        gen = Generator(version=2, spec_mode="replace", char_map={'g': '{', 'q': '.', 'r': '='})
        self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "github.com"), "(`:eF|TJ")

    def test_frequency(self):
            gen = Generator(version=2, spec_freq=2, pass_length=16)
            self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "github.com"), "6tG`*{Xk-%C{{.;&")
        
if __name__ == "__main__":
    unittest.main()