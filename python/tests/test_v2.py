import unittest
from determinist import generate_password
from unittest import TestCase

class TestGenV2(TestCase):
    def test_deterministic_output(self):
        self.assertEqual(generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com"), "Vo`Ns\\f3")

    def test_site_changes_output(self):
        self.assertEqual(generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="reddit.com"), "H%B,9\"Ky")

    def test_master_changes_output(self):
        self.assertEqual(generate_password(version=2, master_pass="Another-Very-Strong-Passphrase", site_name="github.com"), "xoN2t)p'")

    def test_length(self):
        self.assertEqual(len(generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=12)), 12)

    def test_length_diff(self):
        self.assertNotEqual(generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=16), generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=12))

    def test_charset(self):
        self.assertEqual(generate_password(version=2, master_pass="Very-Strong-Passphrase", site_name="github.com", pass_length=16, char_types=["digits","lowercase"]), "ikii50pfdlweu1ru")
        
if __name__ == "__main__":
    unittest.main()