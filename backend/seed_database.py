from app import app
from werkzeug.security import generate_password_hash
from models import db, User, MathTopic, MathProblem, Lesson, ProblemChoice

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

    """Seed the database with initial data"""
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create topics
        topics = [
            MathTopic(name="Algebra",
                      description="Study of mathematical symbols and rules for manipulating these symbols"),
            MathTopic(name="Calculus",
                      description="Study of continuous change and the concepts of differentiation and integration"),
            MathTopic(name="Geometry",
                      description="Study of shapes, sizes, relative positions of figures, and properties of space"),
            MathTopic(name="Statistics",
                      description="Study of the collection, analysis, interpretation, and presentation of data")
        ]
        db.session.add_all(topics)
        db.session.commit()

        # Get topic IDs for reference
        algebra = MathTopic.query.filter_by(name="Algebra").first()
        calculus = MathTopic.query.filter_by(name="Calculus").first()
        geometry = MathTopic.query.filter_by(name="Geometry").first()
        statistics = MathTopic.query.filter_by(name="Statistics").first()

        # Create lessons
        lessons = [
            Lesson(
                title="Introduction to Algebra",
                content="This lesson covers the basics of algebra, including variables, expressions, and equations.",
                topic_id=algebra.id
            ),
            Lesson(
                title="Advanced Algebra",
                content="This lesson dives into advanced algebra topics such as quadratic equations and polynomials.",
                topic_id=algebra.id
            ),
            Lesson(
                title="Introduction to Calculus",
                content="This lesson introduces the concepts of limits, derivatives, and integrals.",
                topic_id=calculus.id
            ),
            Lesson(
                title="Geometry Basics",
                content="This lesson covers the basics of geometry, including points, lines, and angles.",
                topic_id=geometry.id
            ),
            Lesson(
                title="Introduction to Statistics",
                content="This lesson introduces statistical concepts such as mean, median, and mode.",
                topic_id=statistics.id
            )
        ]
        db.session.add_all(lessons)
        
        # Create problems with choices
        problem1 = MathProblem(
            title="What is the derivative of x^2?",
            content="Choose the correct answer:",
            difficulty=2,
            topic_id=calculus.id
        )
        db.session.add(problem1)
        db.session.commit()

        # Add choices for problem1
        choice1 = ProblemChoice(text="2x", problem_id=problem1.id)
        choice2 = ProblemChoice(text="x^2", problem_id=problem1.id)
        choice3 = ProblemChoice(text="1", problem_id=problem1.id)
        choice4 = ProblemChoice(text="2", problem_id=problem1.id)
        db.session.add_all([choice1, choice2, choice3, choice4])
        db.session.commit()

        # Set the correct choice for problem1
        problem1.correct_choice_id = choice1.id
        db.session.commit()

        # Create another problem with choices
        problem2 = MathProblem(
            title="What is the area of a triangle with base 5 and height 10?",
            content="Choose the correct answer:",
            difficulty=1,
            topic_id=geometry.id
        )
        db.session.add(problem2)
        db.session.commit()

        # Add choices for problem2
        choice1 = ProblemChoice(text="25", problem_id=problem2.id)
        choice2 = ProblemChoice(text="50", problem_id=problem2.id)
        choice3 = ProblemChoice(text="75", problem_id=problem2.id)
        choice4 = ProblemChoice(text="100", problem_id=problem2.id)
        db.session.add_all([choice1, choice2, choice3, choice4])
        db.session.commit()

        # Set the correct choice for problem2
        problem2.correct_choice_id = choice2.id
        db.session.commit()

        # Create a test user
        test_user = User(
            username="testuser",
            email="test@example.com",
            password_hash=generate_password_hash("password123")
        )
        db.session.add(test_user)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()