import unittest

from determinist import Generator
from unittest import TestCase

gen = Generator()

class TestGenV2(TestCase):
    def test_deterministic_output(self):
        self.assertEqual(gen.generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com"), "iq{?(#<j")

    def test_site_changes_output(self):
        self.assertEqual(gen.generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="reddit.com"), "GyQl}2TJ")

    def test_master_changes_output(self):
        self.assertEqual(gen.generate_password(version=2, master_pass="Another-Very-Strong-Passphrase", site_name="github.com"), "FPk=;vdR")

    def test_length(self):
        self.assertEqual(len(gen.generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=12)), 12)

    def test_length_diff(self):
        self.assertNotEqual(gen.generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=16), gen.generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=12))

    def test_charset(self):
            self.assertEqual(gen.generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=16, char_types=["digits", "lowercase"]), "naedvteasrje265h")
        
if __name__ == "__main__":
    unittest.main()