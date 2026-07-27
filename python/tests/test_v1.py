import unittest

from determinist import Generator
from unittest import TestCase

class TestGenV1(TestCase):
    def test_deterministic_output(self):
        gen = Generator(version=1)
        self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "github.com"), "gZR5(UQQ")

    def test_site_changes_output(self):
        gen = Generator(version=1)
        self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "reddit.com"), "LkW7(WnU")

    def test_master_changes_output(self):
        gen = Generator(version=1)
        self.assertEqual(gen.generate_password("Another-Very-Strong-Passphrase", "github.com"), "20Ps(XiE")

    def test_length(self):
        gen = Generator(version=1, pass_length=12)
        self.assertEqual(len(gen.generate_password("Very-Strong-Passphrase", "github.com")), 12)

    def test_replace(self):
        gen = Generator(version=1, spec_mode="replace", char_map={'g': '{', 'q': '.', 'r': '='})
        self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "github.com"), "V{Z=5U..")

    def test_frequency(self):
            gen = Generator(version=1, spec_freq=2, pass_length=16)
            self.assertEqual(gen.generate_password("Very-Strong-Passphrase", "github.com"), "wZ\"LV$gZ&R5(UQ*Q")
        
if __name__ == "__main__":
    unittest.main()