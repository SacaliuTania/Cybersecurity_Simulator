#template functions / mechanic 

#1 generate a random attack without naming it 

def build_random_attack_prompt(label):
    return f"""Write a plain incident description involving: {label}, without naming it directly. 
    Do not add any extra text or explanation neither before nor after the description of the attack.
    You can respond with a JSON looking like this {{"description":""}}
    """

def build_prompt(attack):
    return build_random_attack_prompt(attack["label"])