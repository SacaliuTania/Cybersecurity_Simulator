#the types of attacks that can be simulated 

ATTACKS = {
    "sql_injection":{
        "label":"SQL Injection",
        "mechanic": "code_fix", 
        "difficulty": ["easy", "medium", "difficult"]
    },

    "phishing": {
        "label": "Phishing",
        "mechanic": "scenario_identification",
        "difficulty": ["easy", "medium", "difficult"]
    },

    "ransomware": {
        "label": "Ransomware", 
        "mechanic": "scenario_response", 
        "difficulty": ["easy", "medium", "difficult"]
    }


}