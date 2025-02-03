import random
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from db_schema import Question, Option, CorrectAnswer


DATABASE_URL = 'sqlite:///instance/database.db'
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()


integer_questions = [
    {"question_text": "What is the sum of the first 20 prime numbers?", "correct_answer": 639},
    {"question_text": "Find the HCF of 84 and 108.", "correct_answer": 12},
    {"question_text": "How many distinct ways can the letters of the word 'ALGORITHM' be arranged?", "correct_answer": 362880},
    {"question_text": "Calculate the sum of the interior angles of a 12-sided polygon.", "correct_answer": 1800},
    {"question_text": "What is the cube root of 512?", "correct_answer": 8},
    {"question_text": "What is the remainder when 987654321 is divided by 13?", "correct_answer": 9},
    {"question_text": "Find the LCM of 15, 25, and 35.", "correct_answer": 525},
    {"question_text": "How many bits are needed to represent the number 1023 in binary?", "correct_answer": 10},
    {"question_text": "What is the value of 2^10?", "correct_answer": 1024},
    {"question_text": "Find the determinant of the matrix [[2, 3], [4, 5]].", "correct_answer": -2},
    {"question_text": "How many valence electrons are in a silicon atom?", "correct_answer": 4},
    {"question_text": "What is the smallest perfect number greater than 1?", "correct_answer": 6},
    {"question_text": "How many vertices does a dodecahedron have?", "correct_answer": 20},
    {"question_text": "Evaluate the integral of x^2 from 0 to 3.", "correct_answer": 9},
    {"question_text": "How many sides does a nonagon have?", "correct_answer": 9},
    {"question_text": "What is the surface area of a sphere with radius 5? (Use π ≈ 3.14)", "correct_answer": 314},
    {"question_text": "What is the product of all even numbers from 1 to 10?", "correct_answer": 3840},
    {"question_text": "How many elements are there in the power set of a set with 6 elements?", "correct_answer": 64},
    {"question_text": "What is the number of trailing zeros in 100 factorial (100!)?", "correct_answer": 24},
    {"question_text": "Find the sum of the series 1 + 2 + 4 + 8 + ... + 128.", "correct_answer": 255},
    {"question_text": "How many days are in a Julian century?", "correct_answer": 36525},
    {"question_text": "What is the value of the Euler's totient function for 50?", "correct_answer": 20},
    {"question_text": "How many distinct prime factors does 2310 have?", "correct_answer": 4},
    {"question_text": "What is the value of the derivative of sin(x) at x = π/2?", "correct_answer": 0},
    {"question_text": "How many diagonals does a hexagon have?", "correct_answer": 9}
]

multiple_select_questions = [
    {
        "question_text": "Select the programming languages that are statically typed.",
        "options": ["Python", "Java", "C++", "JavaScript"],
        "correct_indices": [1, 2]
    },
    {
        "question_text": "Which of the following algorithms are used for searching?",
        "options": ["Binary Search", "Quick Sort", "Linear Search", "Depth-First Search"],
        "correct_indices": [0, 2]
    },
    {
        "question_text": "Select the types of computer networks.",
        "options": ["LAN", "WAN", "URL", "PAN"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Which of the following data structures are non-linear?",
        "options": ["Array", "Linked List", "Graph", "Binary Tree"],
        "correct_indices": [2, 3]
    },
    {
        "question_text": "Choose the principles of software engineering.",
        "options": ["Encapsulation", "Modularity", "Abstraction", "Inheritance"],
        "correct_indices": [1, 2]
    },
    {
        "question_text": "Select the operating systems.",
        "options": ["Windows", "Linux", "Oracle", "Android"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Which of these sorting algorithms are comparison-based?",
        "options": ["Merge Sort", "Counting Sort", "Heap Sort", "Radix Sort"],
        "correct_indices": [0, 2]
    },
    {
        "question_text": "Select the types of machine learning.",
        "options": ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Quantum Learning"],
        "correct_indices": [0, 1, 2]
    },
    {
        "question_text": "Which of the following are NoSQL databases?",
        "options": ["MySQL", "MongoDB", "Redis", "PostgreSQL"],
        "correct_indices": [1, 2]
    },
    {
        "question_text": "Choose the cloud service providers.",
        "options": ["Google Cloud", "Heroku", "Microsoft Azure", "Oracle"],
        "correct_indices": [0, 2, 3]
    },
    {
        "question_text": "Which of these are object-oriented programming principles?",
        "options": ["Encapsulation", "Recursion", "Polymorphism", "Abstraction"],
        "correct_indices": [0, 2, 3]
    },
    {
        "question_text": "Select the functional programming languages.",
        "options": ["Haskell", "Lisp", "Scala", "COBOL"],
        "correct_indices": [0, 1, 2]
    },
    {
        "question_text": "Which of the following are HTTP methods?",
        "options": ["GET", "POST", "FETCH", "PUT"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Choose the protocols used in networking.",
        "options": ["FTP", "TCP", "SNMP", "XML"],
        "correct_indices": [0, 1, 2]
    },
    {
        "question_text": "Which of these are considered cyber security threats?",
        "options": ["Phishing", "Man-in-the-Middle", "Firewall", "DDoS"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Select the types of database normalization.",
        "options": ["First Normal Form", "Second Normal Form", "Recursive Normal Form", "Third Normal Form"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Which of the following are design patterns?",
        "options": ["Singleton", "Decorator", "Array", "Observer"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Choose the characteristics of Big Data.",
        "options": ["Velocity", "Volume", "Versatility", "Variety"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Which of these are types of operating system kernels?",
        "options": ["Monolithic Kernel", "Microkernel", "Network Kernel", "Hybrid Kernel"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Select the algorithms that use dynamic programming.",
        "options": ["Floyd-Warshall", "Knapsack Problem", "Quick Sort", "Longest Common Subsequence"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Which of the following are sorting algorithms with a time complexity of O(n log n)?",
        "options": ["Merge Sort", "Bubble Sort", "Heap Sort", "Selection Sort"],
        "correct_indices": [0, 2]
    },
    {
        "question_text": "Choose the cloud computing models.",
        "options": ["IaaS", "PaaS", "FaaS", "VPN"],
        "correct_indices": [0, 1, 2]
    },
    {
        "question_text": "Which of these algorithms are used for graph traversal?",
        "options": ["Breadth-First Search", "Depth-First Search", "Binary Search", "Dijkstra's Algorithm"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Select the layers in the OSI model.",
        "options": ["Transport Layer", "Data Link Layer", "Web Layer", "Application Layer"],
        "correct_indices": [0, 1, 3]
    },
    {
        "question_text": "Which of these are considered backend programming languages?",
        "options": ["Python", "JavaScript", "Java", "Ruby"],
        "correct_indices": [0, 2, 3]
    }
]


single_choice_questions = [
    {
        "question_text": "Which country recently landed a spacecraft on the Moon's south pole in 2023?",
        "options": ["USA", "China", "India", "Russia"],
        "correct_index": 2
    },
    {
        "question_text": "In which year did India gain independence from British rule?",
        "options": ["1945", "1947", "1950", "1952"],
        "correct_index": 1
    },
    {
        "question_text": "Who is popularly known as the 'Iron Man of India'?",
        "options": ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Bhagat Singh"],
        "correct_index": 2
    },
    {
        "question_text": "Which film won the 'Best Picture' Oscar award in 2023?",
        "options": ["Everything Everywhere All at Once", "Avatar: The Way of Water", "Top Gun: Maverick", "The Fabelmans"],
        "correct_index": 0
    },
    {
        "question_text": "Which famous Indian meme character says 'Bilkul sahi pakde hain'?",
        "options": ["Gajodhar Bhaiya", "Gutthi", "Angoori Bhabhi", "Daya Bhabhi"],
        "correct_index": 2
    },
    {
        "question_text": "In which city was the historic Dandi March led by Mahatma Gandhi started?",
        "options": ["Ahmedabad", "Mumbai", "Pune", "Surat"],
        "correct_index": 0
    },
    {
        "question_text": "Who is the current Prime Minister of the United Kingdom (as of 2024)?",
        "options": ["Boris Johnson", "Rishi Sunak", "Theresa May", "Keir Starmer"],
        "correct_index": 1
    },
    {
        "question_text": "Which Indian state is known for the festival 'Hornbill'?",
        "options": ["Nagaland", "Mizoram", "Meghalaya", "Arunachal Pradesh"],
        "correct_index": 0
    },
    {
        "question_text": "Who was the first Mughal emperor of India?",
        "options": ["Akbar", "Aurangzeb", "Babur", "Jahangir"],
        "correct_index": 2
    },
    {
        "question_text": "Which popular Hindi meme template features a man shouting 'Thain Thain'?",
        "options": ["Munna Bhaiya", "Chacha Chaudhary", "UP Police", "Angry Prash"],
        "correct_index": 2
    },
    {
        "question_text": "Which historical figure is associated with the phrase 'Jai Jawan, Jai Kisan'?",
        "options": ["Indira Gandhi", "Lal Bahadur Shastri", "Subhas Chandra Bose", "Jawaharlal Nehru"],
        "correct_index": 1
    },
    {
        "question_text": "Which football club won the 2023 UEFA Champions League?",
        "options": ["Manchester City", "Real Madrid", "Paris Saint-Germain", "Chelsea"],
        "correct_index": 0
    },
    {
        "question_text": "Which Indian meme character says 'Aap Chronology Samajhiye'?",
        "options": ["Arvind Kejriwal", "Amit Shah", "Rahul Gandhi", "Narendra Modi"],
        "correct_index": 1
    },
    {
        "question_text": "What was the main objective of the 'Quit India Movement'?",
        "options": ["Economic reform", "Social equality", "Ending British rule in India", "Women's rights"],
        "correct_index": 2
    },
    {
        "question_text": "Which country hosted the 2023 Cricket World Cup?",
        "options": ["England", "India", "Australia", "South Africa"],
        "correct_index": 1
    },
    {
        "question_text": "In Hindi meme culture, who is referred to as 'Taimur ka Papa'?",
        "options": ["Salman Khan", "Saif Ali Khan", "Shahrukh Khan", "Ranbir Kapoor"],
        "correct_index": 1
    },
    {
        "question_text": "Who was the first woman to become the President of India?",
        "options": ["Indira Gandhi", "Sarojini Naidu", "Pratibha Patil", "Sushma Swaraj"],
        "correct_index": 2
    },
    {
        "question_text": "Which company became the first to launch a fully reusable rocket?",
        "options": ["SpaceX", "NASA", "Blue Origin", "ISRO"],
        "correct_index": 0
    },
    {
        "question_text": "Which historic event is associated with the date 'August 15, 1947'?",
        "options": ["Partition of Bengal", "India's Independence", "Jallianwala Bagh Massacre", "Formation of the Indian National Congress"],
        "correct_index": 1
    },
    {
        "question_text": "Which Hindi meme character says 'Mujhe kya? Main to chala!'?",
        "options": ["Baba Sehgal", "Himesh Reshammiya", "Alok Nath", "KRK"],
        "correct_index": 3
    },
    {
        "question_text": "Which famous ruler built the Taj Mahal?",
        "options": ["Shah Jahan", "Akbar", "Aurangzeb", "Humayun"],
        "correct_index": 0
    },
    {
        "question_text": "Which country won the FIFA Women's World Cup in 2023?",
        "options": ["USA", "England", "Spain", "Germany"],
        "correct_index": 2
    },
    {
        "question_text": "Who is known as the 'Night Angle of India'?",
        "options": ["Sarojini Naidu", "Lata Mangeshkar", "Asha Bhosle", "M.S. Subbulakshmi"],
        "correct_index": 0
    },
    {
        "question_text": "Which historic figure is associated with the phrase 'Give me blood, and I will give you freedom'?",
        "options": ["Bhagat Singh", "Subhas Chandra Bose", "Sardar Patel", "Lala Lajpat Rai"],
        "correct_index": 1
    },
    {
        "question_text": "In meme culture, who is known for saying 'Mujhe drugs do'?",
        "options": ["Alok Nath", "Rahul Gandhi", "Sanjay Dutt", "KRK"],
        "correct_index": 2
    }
]
subjective_questions = [
    {"question_text": "What are your thoughts on the role of Rahul Gandhi in Indian politics?"},
    {"question_text": "Explain the significance of Central University of Haryana in the Indian education system."},
    {"question_text": "Discuss the impact of social media on youth culture in India."},
    {"question_text": "What are the benefits and drawbacks of a cashless economy?"},
    {"question_text": "Describe the importance of mental health awareness in today's society."},
    {"question_text": "What measures can be taken to improve the quality of higher education in India?"},
    {"question_text": "How has the Indian film industry influenced global cinema?"},
    {"question_text": "Discuss the environmental challenges faced by developing countries."},
    {"question_text": "What are your views on online education as a permanent solution for higher education?"},
    {"question_text": "Analyze the impact of memes on modern-day communication."},
    {"question_text": "What are the key challenges in India's healthcare sector, and how can they be addressed?"},
    {"question_text": "Explain the role of the United Nations in maintaining global peace."},
    {"question_text": "How has technology transformed the workplace in the last decade?"},
    {"question_text": "What is your opinion on India's current foreign policy towards neighboring countries?"},
    {"question_text": "Discuss the role of women in shaping modern Indian society."},
    {"question_text": "What are the ethical considerations of artificial intelligence in everyday life?"},
    {"question_text": "How can Central University of Haryana contribute more effectively to research and innovation?"},
    {"question_text": "Describe the changes that you would like to see in the Indian education system."},
    {"question_text": "What is your take on the influence of Western culture on Indian traditions and values?"},
    {"question_text": "Discuss the importance of preserving regional languages in India."},
    {"question_text": "What are your thoughts on the role of social movements in driving political change in India?"},
    {"question_text": "Explain the significance of sustainable development in the modern world."},
    {"question_text": "How has Rahul Gandhi's leadership evolved over the years, and what challenges does he face?"},
    {"question_text": "What steps can be taken to bridge the gap between rural and urban education in India?"},
    {"question_text": "Discuss the role of Central University of Haryana in promoting interdisciplinary research."}
]

def add_options(question, options, correct_indices=None, correct_index=None):
    for idx, option_text in enumerate(options):
        is_correct = False
        if correct_indices and idx in correct_indices:
            is_correct = True
        if correct_index is not None and idx == correct_index:
            is_correct = True


        option = Option(question_id=question.id, option_text=option_text, is_correct=is_correct)
        session.add(option)
        session.flush()  

      
        if is_correct:
            correct_answer = CorrectAnswer(question_id=question.id, option_id=option.id)
            session.add(correct_answer)

def add_questions_to_db():
    try:
        # Handle integer type questions correctly
        for q in integer_questions:
            question = Question(question_text=q["question_text"], question_type='integer_type', marks=1)
            session.add(question)
            session.flush()  # Ensures question.id is available for later use
            correct_answer = CorrectAnswer(question_id=question.id, integer_answer=q["correct_answer"])
            session.add(correct_answer)

        # Handle multiple choice questions
        for q in multiple_select_questions:
            question = Question(question_text=q["question_text"], question_type='multiple_choice', marks=2)
            session.add(question)
            session.flush() 
            add_options(question, q["options"], correct_indices=q["correct_indices"])

        # Handle single choice questions
        for q in single_choice_questions:
            question = Question(question_text=q["question_text"], question_type='single_choice', marks=2)
            session.add(question)
            session.flush()  
            add_options(question, q["options"], correct_index=q["correct_index"])

        # Handle subjective questions
        for q in subjective_questions:
            question = Question(question_text=q["question_text"], question_type='subjective', marks=3)
            session.add(question)

        session.commit()
        print("Questions and correct answers added to the database successfully!")

    except Exception as e:
        session.rollback()
        print(f"Failed to add questions: {str(e)}")

if __name__ == '__main__':

    add_questions_to_db()