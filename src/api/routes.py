from flask import Blueprint, jsonify, request
from api.models import db, User, Transaction
from api.utils import APIException

api = Blueprint('api', __name__)

# Rutas para Usuarios
@api.route('/users', methods=['POST'])
def create_user():
    data = request.json
    if not data.get("name") or not data.get("email") or not data.get("password"):
        raise APIException("Faltan campos obligatorios (name, email, password)", status_code=400)

    # Verificar si el correo ya está registrado
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        raise APIException("El correo ya está registrado", status_code=400)

    new_user = User(name=data['name'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201


@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APIException(f"Usuario con ID {user_id} no encontrado", status_code=404)
    return jsonify(user.serialize()), 200


@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APIException(f"Usuario con ID {user_id} no encontrado", status_code=404)
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"Usuario con ID {user_id} eliminado correctamente"}), 200


# Rutas para Transacciones
@api.route('/transactions', methods=['POST'])
def create_transaction():
    data = request.json
    if not data.get("user_id") or not data.get("amount") or not data.get("transaction_type"):
        raise APIException("Faltan campos obligatorios (user_id, amount, transaction_type)", status_code=400)

    user = User.query.get(data['user_id'])
    if not user:
        raise APIException(f"Usuario con ID {data['user_id']} no encontrado", status_code=404)

    new_transaction = Transaction(
        user_id=data['user_id'],
        amount=data['amount'],
        description=data.get('description', ""),
        transaction_type=data['transaction_type']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify(new_transaction.serialize()), 201


@api.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([transaction.serialize() for transaction in transactions]), 200


@api.route('/transactions/<int:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        raise APIException(f"Transacción con ID {transaction_id} no encontrada", status_code=404)
    return jsonify(transaction.serialize()), 200


@api.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        raise APIException(f"Transacción con ID {transaction_id} no encontrada", status_code=404)

    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": f"Transacción con ID {transaction_id} eliminada correctamente"}), 200
