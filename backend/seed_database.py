from app import app
from werkzeug.security import generate_password_hash
from models import db, User, MathTopic, MathProblem, Lesson

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
        
        # Create problems
        problems = [
            MathProblem(
                title="Solving Quadratic Equations",
                content="Solve the quadratic equation: $ax^2 + bx + c = 0$ where $a=1$, $b=5$, and $c=6$.",
                solution="Using the quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\nSubstituting the values: $x = \\frac{-5 \\pm \\sqrt{5^2 - 4 \\cdot 1 \\cdot 6}}{2 \\cdot 1}$\n$x = \\frac{-5 \\pm \\sqrt{25 - 24}}{2}$\n$x = \\frac{-5 \\pm \\sqrt{1}}{2}$\n$x = \\frac{-5 \\pm 1}{2}$\nSo, $x = -3$ or $x = -2$",
                difficulty=2,
                topic_id=algebra.id
            ),
            MathProblem(
                title="Derivative of a Function",
                content="Find the derivative of $f(x) = 3x^4 - 2x^3 + 5x - 7$.",
                solution="Using the power rule and linearity of differentiation:\n$f'(x) = 3 \\cdot 4 \\cdot x^{4-1} - 2 \\cdot 3 \\cdot x^{3-1} + 5 \\cdot x^{1-1} - 0$\n$f'(x) = 12x^3 - 6x^2 + 5$",
                difficulty=3,
                topic_id=calculus.id
            ),
            MathProblem(
                title="Area of a Triangle",
                content="Calculate the area of a triangle with sides of length 3, 4, and 5 units.",
                solution="This is a 3-4-5 right triangle.\nUsing the formula $A = \\frac{1}{2} \\cdot base \\cdot height$\n$A = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6$ square units\nAlternatively, using Heron's formula with $s = \\frac{3+4+5}{2} = 6$:\n$A = \\sqrt{s(s-a)(s-b)(s-c)} = \\sqrt{6 \\cdot 3 \\cdot 2 \\cdot 1} = \\sqrt{36} = 6$ square units",
                difficulty=2,
                topic_id=geometry.id
            ),
            MathProblem(
                title="Standard Deviation",
                content="Calculate the standard deviation of the dataset: $\\{4, 7, 8, 9, 10, 12\\}$.",
                solution="Step 1: Find the mean:\n$\\mu = \\frac{4+7+8+9+10+12}{6} = \\frac{50}{6} = 8.33$\nStep 2: Find the squared deviations from the mean:\n$(4-8.33)^2 = 18.77$\n$(7-8.33)^2 = 1.77$\n$(8-8.33)^2 = 0.11$\n$(9-8.33)^2 = 0.45$\n$(10-8.33)^2 = 2.78$\n$(12-8.33)^2 = 13.45$\nStep 3: Find the mean of the squared deviations:\n$\\sigma^2 = \\frac{18.77+1.77+0.11+0.45+2.78+13.45}{6} = \\frac{37.33}{6} = 6.22$\nStep 4: Take the square root of the variance:\n$\\sigma = \\sqrt{6.22} \\approx 2.49$",
                difficulty=4,
                topic_id=statistics.id
            )
        ]
        db.session.add_all(problems)

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