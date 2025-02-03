from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
from db_schema import User, Question,  Base  
from sqlalchemy.sql.expression import func
import json
import os
from dotenv import load_dotenv


# Load environment variables from .env
load_dotenv()

app = Flask(__name__, static_folder='dist', static_url_path='')

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
db = SQLAlchemy(app)
jwt = JWTManager(app)
BASE_UPLOAD_DIR = 'data'
os.makedirs(BASE_UPLOAD_DIR, exist_ok=True)

db.Model = Base  
Base.query = db.session.query_property() 

ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')


@app.route('/api/questions', methods=['GET'])
def get_random_questions():
    try:
        questions_count = int(open('question_count.txt', 'r').readlines()[0])
        base_count = questions_count // 4
        remainder = questions_count % 4  # To handle the remainder after division by 4
        questions_count = int(open('question_count.txt', 'r').readlines()[0])
      

       
        single_correct_questions = Question.query.filter_by(question_type='single_choice').order_by(func.random()).limit(base_count + (1 if remainder > 0 else 0)).all()
        multiple_correct_questions = Question.query.filter_by(question_type='multiple_choice').order_by(func.random()).limit(base_count + (1 if remainder > 1 else 0)).all()
        integer_questions = Question.query.filter_by(question_type='integer_type').order_by(func.random()).limit(base_count + (1 if remainder > 2 else 0)).all()
        subjective_questions = Question.query.filter_by(question_type='subjective').order_by(func.random()).limit(base_count).all()

     
       
        questions = single_correct_questions + multiple_correct_questions + integer_questions + subjective_questions
        print(len(integer_questions))
        

        questions_data = []
        for question in questions:
            question_data = {
                'id': question.id,
                'question_text': question.question_text,
                'question_type': question.question_type,
                'marks': question.marks,
                'options': [
                    {
                        'id': option.id,
                        'option_text': option.option_text,
                        'is_correct': option.is_correct
                    } for option in question.options
                ] if question.options else None,
                'created_at': question.created_at,
                'updated_at': question.updated_at
            }
            questions_data.append(question_data)
        
       
        return jsonify({'questions': questions_data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch questions', 'message': str(e)}), 500


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_react_app(path):
    
#     if path.startswith('api/'):
#         return jsonify({'error': 'API route not found'}), 404

  
#     return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()

    
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    age = data.get('age')
    password = data.get('password')


    if not all([name, email, phone_number, age, password]):
        return jsonify({'error': 'All fields are required.'}), 400

    new_user = User(name=name, email=email, phone_number=phone_number, age=age)
    new_user.set_password(password)  
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully.'}), 201

    except IntegrityError:
        db.session.rollback()
        existing_user = User.query.filter(
            (User.email == email) | (User.phone_number == phone_number)
        ).first()
        if existing_user and existing_user.email == email:
            return jsonify({'error': 'Email is already registered.'}), 400
        if existing_user and existing_user.phone_number == phone_number:
            return jsonify({'error': 'Phone number is already registered.'}), 400

        return jsonify({'error': 'Registration failed due to a database error.'}), 500


@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email_or_phone = data.get('email')
    password = data.get('password')

    user = User.query.filter(
        (User.email == email_or_phone) | (User.phone_number == email_or_phone)
    ).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid credentials.'}), 401



@app.route('/api/loginadmin', methods=['GET','POST'])
def admin_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
            access_token = create_access_token(identity='admin')
            return jsonify({'access_token': access_token, 'role': 'admin'}), 200
        else:
            return jsonify({'error': 'Invalid admin credentials.'}), 401
    except Exception as e:
        return jsonify({'error': 'Failed to process admin login.', 'message': str(e)}), 500



@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({'message': f'Welcome, {user.name}!'})


@app.route('/api/submit-exam', methods=['POST'])
def submit_exam():
    
    user_email = request.form.get('user_email') 
    if not user_email:
        return {'error': 'User email not provided'}, 400


    user_directory = os.path.join('data', user_email)
    os.makedirs(user_directory, exist_ok=True)

 
    answers = request.form.get('answers')
    if answers:
        answers = json.loads(answers)
        with open(os.path.join(user_directory, 'answers.json'), 'w') as f:
            json.dump(answers, f)
    print( answers)
    
    return jsonify({'message': 'Exam submitted successfully'}), 200



def create_user_directory(email):
    user_directory = os.path.join(BASE_UPLOAD_DIR, email)
    if not os.path.exists(user_directory):
        os.makedirs(user_directory)
    return user_directory

@app.route('/api/upload-webcam', methods=['POST'])
def upload_webcam():
    user_email = request.form.get('user_email')
    if not user_email:
        return jsonify({'error': 'User email is required'}), 400
    
    if 'webcamRecording' not in request.files:
        return jsonify({'error': 'No webcam recording file provided'}), 400

    webcam_file = request.files['webcamRecording']
    user_directory = create_user_directory(user_email)
    webcam_file.save(os.path.join(user_directory, 'webcam_recording.webm'))

    return jsonify({'message': 'Webcam recording uploaded successfully'}), 200



def create_user_directory(user_email):
    user_directory = os.path.join('data', user_email)
    os.makedirs(user_directory, exist_ok=True)
    return user_directory

@app.route('/api/upload-screen', methods=['POST'])
def upload_screen():
    user_email = request.form.get('user_email')
    if not user_email:
        return jsonify({'error': 'User email is required'}), 400
    
    if 'screenRecording' not in request.files:
        return jsonify({'error': 'No screen recording file provided'}), 400


    screen_file = request.files['screenRecording']

    user_directory = create_user_directory(user_email)
    

    webm_file_path = os.path.join(user_directory, 'screen_recording.webm')
    

    screen_file.save(webm_file_path)


    if 'webcamRecording' in request.files: 
        webcam_file = request.files['webcamRecording']
        webcam_webm_file_path = os.path.join(user_directory, 'webcam_recording.webm')
       
        webcam_file.save(webcam_webm_file_path)

    return jsonify({'message': 'Screen and webcam recordings uploaded successfully'}), 200

if __name__ == '__main__':
 
    app.run( port=5000)
    
