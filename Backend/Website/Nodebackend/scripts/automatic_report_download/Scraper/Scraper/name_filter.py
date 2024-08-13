import re

def find_string(string, search): 
    return re.search(search, string, re.IGNORECASE) != None

def name_filter(string):
    words = ["non_financial", "non-financial", "nonfinancial", "sustainable", "sustainability", 
    "nichtfinanzieller", "NFR", "environmental", "nachhaltig", "nachhaltigkeit", "nhb", "annual", "sr", "cr"]       #list of allowed keywords
    exclude_words = ["half", "halb", "quarter", "quartal", "quarterly" "q1", "q2", "q3", "analyst"]         #list of excluded keywords
    year = [i for i in range(2000,2025)]
    for word in exclude_words:
        if find_string(string, word):
            return False
    for word in words:
        if find_string(string, word):
            return True
