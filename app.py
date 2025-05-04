from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="your-host",
    user="your-username",
    password="your-password",
    database="householdmanagement"
)

@app.route('/api/dashboard')
def dashboard_data():
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT SUM(total_cost) AS total_expenses FROM expense")
    total_expenses = cursor.fetchone()['total_expenses']

    cursor.execute("SELECT SUM(amount) AS total_payments FROM payment")
    total_payments = cursor.fetchone()['total_payments']

    cursor.execute("SELECT SUM(balance) AS total_balance FROM roommate")
    net_balance = cursor.fetchone()['total_balance']

    return jsonify({
        "total_expenses": total_expenses,
        "total_payments": total_payments,
        "net_balance": net_balance
    })

# Add similar routes for roommates, payments, etc.

if __name__ == '__main__':
    app.run(debug=True)
