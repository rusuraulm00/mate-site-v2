from flask import Blueprint, request, jsonify
from aplicatie import db, MathProblem, UserProblem
from auth import token_required

problems = Blueprint('problems', __name__)

@problems.route('/', methods=['GET'])
def get_problems():
    """Get all math problems, with optional filtering by topic"""
    topic_id = request.args.get('topic_id')
    difficulty = request.args.get('difficulty')

    query = MathProblem.query

    if topic_id:
        query = query.filter_by(topic_id=topic_id)

    if difficulty:
        query = query.filter_by(difficulty=difficulty)

    problems = query.all()
    return jsonify([problem.to_dict() for problem in problems])


@problems.route('/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    """Get a specific math problem by ID"""
    problem = MathProblem.query.get_or_404(problem_id)
    return jsonify(problem.to_dict())

@problems.route('/', methods=['POST'])
@token_required
def create_problem(current_user):
    data = request.get_json()

    if not data or not data.get('title') or not data.get('content') or not data.get('solution'):
        return jsonify({"error": "Title, content, and solution are required"}), 400

    problem = MathProblem(
        title=data.get('title'),
        content=data.get('content'),
        solution=data.get('solution'),
        difficulty=data.get('difficulty', 1),
        topic_id=data.get('topic_id')
    )

    db.session.add(problem)
    db.session.commit()

    return jsonify(problem.to_dict()), 201


@problems.route('/<int:problem_id>/solution', methods=['POST'])
@token_required
def submit_solution(current_user, problem_id):
    """Submit a solution to a problem"""
    problem = MathProblem.query.get_or_404(problem_id)
    data = request.get_json()

    if not data or not data.get('user_solution'):
        return jsonify({"error": "Solution is required"}), 400

    is_correct = data.get('user_solution').strip() == problem.solution.strip()

    # Record the user's attempt
    user_problem = UserProblem(
        user_id=current_user.id,
        problem_id=problem_id,
        user_solution=data.get('user_solution'),
        is_correct=is_correct
    )

    db.session.add(user_problem)
    db.session.commit()

    return jsonify({
        'is_correct': is_correct,
        'solution': problem.solution if not is_correct else None
    })


@problems.route('/user-progress', methods=['GET'])
@token_required
def get_user_progress(current_user):
    """Get the current user's progress"""
    user_problems = UserProblem.query.filter_by(user_id=current_user.id).all()

    # Group by problem and keep only the latest attempt for each problem
    problem_attempts = {}
    for up in user_problems:
        if up.problem_id not in problem_attempts or up.solved_at > problem_attempts[up.problem_id].solved_at:
            problem_attempts[up.problem_id] = up

    # Calculate statistics
    total_attempts = len(user_problems)
    total_problems_attempted = len(problem_attempts)
    total_problems_solved = sum(1 for up in problem_attempts.values() if up.is_correct)

    # Get details about solved and unsolved problems
    solved_problems = []
    unsolved_problems = []

    for problem_id, attempt in problem_attempts.items():
        problem = MathProblem.query.get(problem_id)
        if problem:
            if attempt.is_correct:
                solved_problems.append({
                    'problem_id': problem_id,
                    'title': problem.title,
                    'topic_id': problem.topic_id,
                    'difficulty': problem.difficulty,
                    'solved_at': attempt.solved_at.isoformat()
                })
            else:
                unsolved_problems.append({
                    'problem_id': problem_id,
                    'title': problem.title,
                    'topic_id': problem.topic_id,
                    'difficulty': problem.difficulty,
                    'last_attempt': attempt.solved_at.isoformat()
                })

    return jsonify({
        'total_attempts': total_attempts,
        'total_problems_attempted': total_problems_attempted,
        'total_problems_solved': total_problems_solved,
        'solved_problems': solved_problems,
        'unsolved_problems': unsolved_problems
    })

